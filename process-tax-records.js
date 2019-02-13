(() => {

    const theYear = 2018

    const padNumber = number =>
        number < 10 ? '0' + number : number

    const moveOneDayBack = date => {
        date.setDate(date.getDate() - 1)
        return date
    }

    const getCurrencyDateString = date =>
        date.getFullYear() + '-' + padNumber((date.getMonth() + 1)) + '-' + padNumber(date.getDate())

    const fetchExchangeRate = date =>
        fetch(`https://api.nbp.pl/api/exchangerates/rates/a/usd/${getCurrencyDateString(date)}/?format=json`)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                        .then(data => data.rates[0].mid)
                }
                if (response.status === 404) {
                    return undefined;
                }
                return Promise.reject(Error('problem fetching rate from nbp.pl'));
            })

    const getExchangeRate = (date, tries = 3) => {
        if (tries > 0) {
            return fetchExchangeRate(moveOneDayBack(date))
                .then(rate => rate || getExchangeRate(date, tries - 1))
        }
        return Promise.reject(Error('no rate found!'))
    }

    const session = JSON.parse(sessionStorage.getItem('session_state'))

    const fetchData = url =>
        fetch(url, {
            credentials: 'include',
            headers: {
                Authorization: session.api.sessionToken
            }
        })
        .then(response => response.json())

    const fetchSaleDetails = transactionId =>
        fetchData(session.api.baseUri + session.api.baseLegacyUriSuffix + '/withdrawals/' + transactionId)

    const fetchRtSaleDetails = transactionId =>
        fetchData(session.api.baseUri + session.api.baseLegacyUriSuffix + '/withdrawals/realtimeTransactions/' + transactionId)

    const fetchHistoryRecords = () =>
        fetchData(session.api.baseUri + session.api.baseLegacyUriSuffix + '/participants/' + session.participant.activeAccount.employeePK + '/txHistory')
            .then(data => data.txs)

    const processSaleDetails = sale =>
        fetchExchangeRate(new Date(sale.settlementDate))
            .then(exchangeRate => {
                const longTermCostTransactions = (sale.costBasis.longTerm && sale.costBasis.longTerm.rows) || []
                const shortTermCostTransactions = (sale.costBasis.shortTerm && sale.costBasis.shortTerm.rows) || []
                return longTermCostTransactions.concat(shortTermCostTransactions).map(transaction => {
                    let taxableAmountUSD;
                    const purchaseDate = new Date(transaction.purchaseDate)
                    const marketValuePerShare = Number(transaction.marketValuePerShare.amount)
                    const bookValuePerShare = Number(transaction.bookValuePerShare.amount)
                    const quantity = Number(transaction.quantity)
                    if (purchaseDate.getFullYear() < 2018) {
                        taxableAmountUSD = Math.max((marketValuePerShare - bookValuePerShare) * quantity, 0)
                    } else {
                        taxableAmountUSD = marketValuePerShare * quantity
                    }
                    const taxableAmountPLN = taxableAmountUSD * exchangeRate
                    const taxAmountPLN = taxableAmountPLN * 0.19
                    return {purchaseDate, bookValuePerShare, marketValuePerShare, quantity, taxableAmountUSD, exchangeRate, taxableAmountPLN, taxAmountPLN}
                })
            })

    fetchHistoryRecords()
        .then(records => records.filter(record => record.txApiType.includes('WITHDRAWAL') && (new Date(record.settlementDate)).getFullYear() === theYear))
        .then(sales => Promise.all(sales.map(sale => {
            const promise = sale.txApiType === 'WITHDRAWAL_REALTIME_TRANSACTION' ? fetchRtSaleDetails(sale.realtimeTransactionPK) : fetchSaleDetails(sale.spfWithdrawalPK)
            return promise.then(processSaleDetails)
                .then(taxableDetails => ({
                    transactionDate: sale.transactionDate,
                    settlementDate: sale.settlementDate,
                    quantity: sale.quantity,
                    taxableDetails
                }))
        })))
        .then(sales => {
            if (sales.length) {
                let grandTaxTotalPLN = 0;
                sales.forEach(sale => {
                    const totalTaxAmountPLN = sale.taxableDetails.reduce((acc, curr) => acc + curr.taxAmountPLN , 0)
                    grandTaxTotalPLN += totalTaxAmountPLN
                    console.log(`You sold ${sale.quantity} shares on ${sale.transactionDate} (settled on ${sale.settlementDate}). Total tax amount is ${totalTaxAmountPLN.toFixed(2)} PLN. Details:`)
                    console.table(sale.taxableDetails)
                })
                console.log(`all of that tax sums up to ${grandTaxTotalPLN.toFixed(2)} PLN`)
            } else {
                console.log(`seems like there is nothing to declare (no sales in ${theYear}), but please double check just in case`)
            }
        })
})()
