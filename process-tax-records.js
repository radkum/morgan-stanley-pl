/**
 * Released under the MIT license
 */

(() => {

	'use strict'

	const PERIOD_START = '2016-01-01'

	const PERIOD_END = '2016-31-12'

	const COMPANY_ID = '93N'

	const PLAN_ID = '93N'

	const JSON_BASE = '/app-bin/spc/ba/sps'

	const padNumber = number => number < 10 ? '0' + number : number

	const getCurrencyDateString = date => date.getFullYear() + '-' + padNumber((date.getMonth() + 1)) + '-' + padNumber(date.getDate())

	const getURLDateString = date => date.getFullYear() + '-' + padNumber(date.getDate()) + '-' + padNumber((date.getMonth() + 1))

	const parseDollars = dollars => dollars.replace('$', '').replace(/,/g, '')

	const fetchData = url =>
		fetch(url, {
			credentials: 'include',
			headers: new Headers({
				'X-XSRF-TOKEN': getXsrfToken()
			})
		})
		.then(response => response.text())
		.then(text => JSON.parse(filterResponseGarbage(text)))

	const moveOneDayBack = date => {
		date.setDate(date.getDate() - 1)
		return date
	}

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

	const filterResponseGarbage = response => response.substr(response.indexOf('{'))

	const getXsrfToken = () =>
		document.cookie
			.split(';')
			.filter((cookie) => cookie.indexOf('XSRF-TOKEN') !== -1)
			.pop()
			.split('=')
			.pop()

	const processReleases = releases =>
		Promise.all(releases
			.map(release =>
				getExchangeRate(new Date(release.tradeDate))
					.then(exchangeRate => {
						const shareUnits = Number(release.shares)
						const shareValue = Number(parseDollars(release.salePrice))
						const totalUSD = shareUnits * shareValue

						return {
							tradeDate: release.tradeDate,
							shareUnits,
							shareValue,
							totalUSD,
							exchangeRate,
							totalPLN: totalUSD * exchangeRate
						}
					})
			)
		)
		.then(partials => {
			const totalReleaseEarned = partials
				.reduce((previous, current) => previous + current.totalPLN, 0)

			if (console.table) {
				console.log('%crelease details:', 'color: blue')
				console.table(partials)
			}
			console.log(`%creleases total is %c${totalReleaseEarned.toFixed(2)} PLN`, 'color: blue', 'color: red')
			console.log('%cyou may want to put that into PIT/ZG p. 24 and PIT-36 p. 85 p. 136', 'color: blue')
		})

	const getDividendDetails = dividend => {
		const orderDate = getURLDateString(new Date(dividend.orderDate))
		return fetchData(`${JSON_BASE}/transaction/details/${COMPANY_ID}/${PLAN_ID}/K?orderDate=${orderDate}&orderNumber=${dividend.orderNumberForUIRef}&segmentId=${dividend.segmentId}&fromOrder=closedOrder&format=json`)
			.then(data => data.orderDetail.dataSet.DATA.pop());
	}

	const processDividends = dividends =>
		Promise.all(dividends
			.map(dividend =>
				Promise.all([getExchangeRate(new Date(dividend.tradeDate)), getDividendDetails(dividend)])
					.then(([exchangeRate, dividendDetails]) => {
						const grossDividendCredit = Number(parseDollars(dividendDetails.grossDividendCredi))
						return {
							tradeDate: dividend.tradeDate,
							grossDividendCredit,
							exchangeRate,
							totalPLN: grossDividendCredit * exchangeRate
						}
					})
			)
		)
		.then(partials => {
			const totalDividendEarned = partials
				.reduce((previous, current) => previous + current.totalPLN, 0)

			if (console.table) {
				console.log('%cdividend details:', 'color: brown')
				console.table(partials)
			}
			console.log(`%c19% of dividends total is %c${(totalDividendEarned * 0.19).toFixed(2)} PLN`, 'color: brown', 'color: red')
			console.log('%cyou may want to put that into PIT-38 p. 37. Alternatively PIT-36 p. 218, if you don\'t need PIT-38', 'color: brown')
		})

	const processWithholdings = withholdings =>
		Promise.all(withholdings
			.map(withholding =>
				getExchangeRate(new Date(withholding.tradeDate))
					.then(exchangeRate => {
						const netCashProceeds = Number(parseDollars(withholding.netCashProceeds))
						return {
							tradeDate: withholding.tradeDate,
							netCashProceeds,
							exchangeRate,
							totalPLN: netCashProceeds * exchangeRate
						}
					})

			)
		)
		.then(partials => {
			const totalWithholdings = partials
				.reduce((previous, current) => previous + current.totalPLN, 0)

			if (console.table) {
				console.log('%cdividend withholding details:', 'color: darkgreen')
				console.table(partials)
			}
			console.log(`%cdividend witholdings total is %c${totalWithholdings.toFixed(2)} PLN`, 'color: darkgreen', 'color: red')
			console.log('%cyou may want to put that into PIT-38 p. 38. Alternatively PIT-36 p. 220, if you don\'t need PIT-38', 'color: darkgreen')
		})

	const getSaleRelatedBuyCosts = shareLots =>
		Promise.all(shareLots
			.map(shareLot => getExchangeRate(new Date(shareLot.acquiredDate))
				.then(exchangeRate => Number(shareLot.sharesSold) * Number(parseDollars(shareLot.acquiredPrice)) * exchangeRate))
		)
		.then(shareLotCosts => shareLotCosts.reduce((previous, current) => previous + current, 0))

	const getSaleDetails = sale => {
		const orderDate = getURLDateString(new Date(sale.orderDate))
		return fetchData(`${JSON_BASE}/transaction/details/${COMPANY_ID}/${PLAN_ID}/K?orderDate=${orderDate}&orderNumber=${sale.orderNumber}&segmentId=${sale.segmentId}&fromOrder=closedOrder&format=json`)
			.then(data => {
				const proceedDetails = data.proceedsDetails.dataSet.DATA.pop()
				const orderDetail = data.orderDetail.dataSet.DATA.pop()
				const buyTransactions = data.shareLots.dataSet.DATA
				return Promise.all([getExchangeRate(new Date(orderDetail.trxTradeDate)), getSaleRelatedBuyCosts(buyTransactions)])
					.then(([exchangeRate, buyCosts]) => {
						const sellValue = Number(parseDollars(proceedDetails.grossProceeds)) * exchangeRate
						const transactionCost = Number(parseDollars(proceedDetails.totalFees)) * exchangeRate
						return {
							tradeDate: orderDetail.trxTradeDate,
							sellValue,
							exchangeRate,
							transactionCost,
							buyCosts,
							totalCost: buyCosts + transactionCost,
							profit: sellValue - buyCosts - transactionCost,
							buyTransactions
						}
					})
			})
	}

	const getSaleBuyTransactions = sale =>
		Promise.all(sale.buyTransactions
			.map(transaction =>
				getExchangeRate(new Date(transaction.acquiredDate))
					.then(exchangeRate => {
						const acquiredPrice = Number(parseDollars(transaction.acquiredPrice))
						const sharesSold = Number(transaction.sharesSold)
						return {
							tradeDate: transaction.acquiredDate,
							sharesSold,
							acquiredPrice,
							exchangeRate,
							acquiredPLN: sharesSold * acquiredPrice * exchangeRate
						}
					})
				))

	const processSales = sales => {
		if (!sales.length) {
			console.log('%cno sale records found', 'color: green')
			return Promise.resolve()
		}
		return Promise.all(sales.map(getSaleDetails))
			.then(sales => {
				if (console.table) {
					console.log('%csale details:', 'color: darkorange')
					console.table(sales, ['tradeDate','sellValue','exchangeRate','transactionCost','buyCosts','totalCost','profit'])
					console.log('%csale details breakdowns:', 'color: darkorange')
					return Promise.all(sales.map((sale, index) =>
						getSaleBuyTransactions(sale)
							.then(buyTransactions => {
								console.log(`%csale ${index + 1} related buy transactions`, 'color: darkorange')
								console.table(buyTransactions)
							}))
						)
						.then(() => sales)
				}
				return sales;
			})
			.then(sales => {
				const totalSellValue = sales.reduce((previous, current) => previous + current.sellValue, 0)
				const totalCost = sales.reduce((previous, current) => previous + current.totalCost, 0)
				const totalProfit = sales.reduce((previous, current) => previous + current.profit, 0)

				console.log('%csells grand totals:', 'color: darkorange')
				console.log(`%csells total value is %c${totalSellValue.toFixed(2)} PLN`, 'color: darkorange', 'color: red')
				console.log('%cyou may want to put that into PIT-38 p. 22', 'color: darkorange')
				console.log(`%csells total cost is %c${totalCost.toFixed(2)} PLN`, 'color: darkorange', 'color: red')
				console.log('%cyou may want to put that into PIT-38 p. 23', 'color: darkorange')
				console.log(`%csells total profit is %c${totalProfit.toFixed(2)} PLN`, 'color: darkorange', 'color: red')
				console.log('%cyou may want to put that into PIT/ZG p. 31', 'color: darkorange')
			})
	}

	console.info('%cfetching data...', 'font-weight: bold;')
	console.warn('%cplease ignore the \"%cGET https://api.nbp.pl/api/exchangerates/rates/a/usd/YYYY-MM-DD/?format=json 404 (Not Found - Brak danych)\" errors logged on the console by the browser - %cTHEY ARE EXPECTED', 'font-weight: bold;', 'font-style: italic', 'color:green;font-weight: bold;')

	fetchData(`${JSON_BASE}/transactions/${COMPANY_ID}/K/${PLAN_ID}/duration/between/${PERIOD_START}/${PERIOD_END}?format=json`)
		.then(data => {
			const records = data.closedOrders.dataSet.DATA
			return Promise.all([
				processReleases(records.filter((record) => record.transactionType === 'Release')),
				processDividends(records.filter((record) => record.transactionType === 'Dividend Credit')),
				processWithholdings(records.filter((record) => record.transactionType === 'IRS Withholding')),
				processSales(records.filter((record) => record.transactionType === 'Sale'))
			])
		})
		.then(() => {
			console.log('%call done ~ FIN ~', 'color: green')
		})
		.catch(error => console.log('ups!, ' + error))
})()
