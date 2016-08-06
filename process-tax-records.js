/**
 * Released under the MIT license
 */

(() => {

	'use strict'

	const PERIOD_START = '2015-01-01'

	const PERIOD_END = '2015-31-12'

	const COMPANY_ID = '93N'

	const PLAN_ID = '93N'

	const JSON_BASE = '/app-bin/spc/ba/sps'

	const CURRENCY_VALUES = JSON.parse('{\"01/02/2014\":3.0315,\"01/03/2014\":3.0517,\"01/07/2014\":3.0688,\"01/08/2014\":3.0717,\"01/09/2014\":3.0695,\"01/10/2014\":3.07,\"01/13/2014\":3.045,\"01/14/2014\":3.04,\"01/15/2014\":3.0495,\"01/16/2014\":3.0566,\"01/17/2014\":3.0596,\"01/20/2014\":3.068,\"01/21/2014\":3.0763,\"01/22/2014\":3.0761,\"01/23/2014\":3.0559,\"01/24/2014\":3.0727,\"01/27/2014\":3.0884,\"01/28/2014\":3.0635,\"01/29/2014\":3.0829,\"01/30/2014\":3.1166,\"01/31/2014\":3.1288,\"02/03/2014\":3.137,\"02/04/2014\":3.1189,\"02/05/2014\":3.0987,\"02/06/2014\":3.095,\"02/07/2014\":3.0857,\"02/10/2014\":3.0683,\"02/11/2014\":3.0581,\"02/12/2014\":3.0552,\"02/13/2014\":3.0532,\"02/14/2014\":3.0334,\"02/17/2014\":3.025,\"02/18/2014\":3.03,\"02/19/2014\":3.0286,\"02/20/2014\":3.049,\"02/21/2014\":3.0389,\"02/24/2014\":3.0255,\"02/25/2014\":3.0264,\"02/26/2014\":3.026,\"02/27/2014\":3.0655,\"02/28/2014\":3.0254,\"03/03/2014\":3.0462,\"03/04/2014\":3.0489,\"03/05/2014\":3.0477,\"03/06/2014\":3.0427,\"03/07/2014\":3.0185,\"03/10/2014\":3.0266,\"03/11/2014\":3.0449,\"03/12/2014\":3.0508,\"03/13/2014\":3.0284,\"03/14/2014\":3.0481,\"03/17/2014\":3.043,\"03/18/2014\":3.0396,\"03/19/2014\":3.0245,\"03/20/2014\":3.05,\"03/21/2014\":3.0425,\"03/24/2014\":3.0483,\"03/25/2014\":3.0342,\"03/26/2014\":3.0318,\"03/27/2014\":3.0401,\"03/28/2014\":3.0374,\"03/31/2014\":3.0344,\"04/01/2014\":3.0278,\"04/02/2014\":3.0288,\"04/03/2014\":3.033,\"04/04/2014\":3.0397,\"04/07/2014\":3.0446,\"04/08/2014\":3.0276,\"04/09/2014\":3.0221,\"04/10/2014\":3.0092,\"04/11/2014\":3.0086,\"04/14/2014\":3.0288,\"04/15/2014\":3.0325,\"04/16/2014\":3.0272,\"04/17/2014\":3.0317,\"04/18/2014\":3.0265,\"04/22/2014\":3.034,\"04/23/2014\":3.0273,\"04/24/2014\":3.0285,\"04/25/2014\":3.0378,\"04/28/2014\":3.0368,\"04/29/2014\":3.0318,\"04/30/2014\":3.044,\"05/02/2014\":3.0289,\"05/05/2014\":3.031,\"05/06/2014\":3.0196,\"05/07/2014\":3.0187,\"05/08/2014\":3.0042,\"05/09/2014\":3.0247,\"05/12/2014\":3.0362,\"05/13/2014\":3.0381,\"05/14/2014\":3.048,\"05/15/2014\":3.0589,\"05/16/2014\":3.0567,\"05/19/2014\":3.0558,\"05/20/2014\":3.062,\"05/21/2014\":3.054,\"05/22/2014\":3.0525,\"05/23/2014\":3.049,\"05/26/2014\":3.0466,\"05/27/2014\":3.0532,\"05/28/2014\":3.0598,\"05/29/2014\":3.0395,\"05/30/2014\":3.0435,\"06/02/2014\":3.0413,\"06/03/2014\":3.0449,\"06/04/2014\":3.0491,\"06/05/2014\":3.0275,\"06/06/2014\":3.0222,\"06/09/2014\":3.0067,\"06/10/2014\":3.0303,\"06/11/2014\":3.0431,\"06/12/2014\":3.0374,\"06/13/2014\":3.0382,\"06/16/2014\":3.0654,\"06/17/2014\":3.0495,\"06/18/2014\":3.0589,\"06/20/2014\":3.0495,\"06/23/2014\":3.0627,\"06/24/2014\":3.0526,\"06/25/2014\":3.0451,\"06/26/2014\":3.0361,\"06/27/2014\":3.0485,\"06/30/2014\":3.0473,\"07/01/2014\":3.0355,\"07/02/2014\":3.0387,\"07/03/2014\":3.0418,\"07/04/2014\":3.0495,\"07/07/2014\":3.0497,\"07/08/2014\":3.0441,\"07/09/2014\":3.0322,\"07/10/2014\":3.0323,\"07/11/2014\":3.0426,\"07/14/2014\":3.0368,\"07/15/2014\":3.0454,\"07/16/2014\":3.0503,\"07/17/2014\":3.0579,\"07/18/2014\":3.0652,\"07/21/2014\":3.07,\"07/22/2014\":3.0748,\"07/23/2014\":3.0707,\"07/24/2014\":3.0702,\"07/25/2014\":3.0831,\"07/28/2014\":3.086,\"07/29/2014\":3.09,\"07/30/2014\":3.0978,\"07/31/2014\":3.1094,\"08/01/2014\":3.128,\"08/04/2014\":3.1114,\"08/05/2014\":3.1121,\"08/06/2014\":3.1377,\"08/07/2014\":3.1397,\"08/08/2014\":3.1509,\"08/11/2014\":3.1378,\"08/12/2014\":3.1465,\"08/13/2014\":3.1442,\"08/14/2014\":3.1285,\"08/18/2014\":3.1342,\"08/19/2014\":3.1356,\"08/20/2014\":3.147,\"08/21/2014\":3.1569,\"08/22/2014\":3.152,\"08/25/2014\":3.168,\"08/26/2014\":3.1686,\"08/27/2014\":3.1764,\"08/28/2014\":3.1834,\"08/29/2014\":3.1965,\"09/01/2014\":3.2035,\"09/02/2014\":3.2112,\"09/03/2014\":3.1912,\"09/04/2014\":3.1947,\"09/05/2014\":3.2354,\"09/08/2014\":3.2303,\"09/09/2014\":3.2605,\"09/10/2014\":3.2508,\"09/11/2014\":3.2435,\"09/12/2014\":3.2468,\"09/15/2014\":3.2522,\"09/16/2014\":3.2419,\"09/17/2014\":3.2331,\"09/18/2014\":3.249,\"09/19/2014\":3.2507,\"09/22/2014\":3.257,\"09/23/2014\":3.243,\"09/24/2014\":3.2525,\"09/25/2014\":3.2823,\"09/26/2014\":3.2776,\"09/29/2014\":3.3,\"09/30/2014\":3.2973,\"10/01/2014\":3.3172,\"10/02/2014\":3.3039,\"10/03/2014\":3.3079,\"10/06/2014\":3.3343,\"10/07/2014\":3.3106,\"10/08/2014\":3.305,\"10/09/2014\":3.2776,\"10/10/2014\":3.2985,\"10/13/2014\":3.3062,\"10/14/2014\":3.3095,\"10/15/2014\":3.3262,\"10/16/2014\":3.2985,\"10/17/2014\":3.2964,\"10/20/2014\":3.3109,\"10/21/2014\":3.2987,\"10/22/2014\":3.3275,\"10/23/2014\":3.339,\"10/24/2014\":3.3387,\"10/27/2014\":3.3288,\"10/28/2014\":3.3295,\"10/29/2014\":3.3192,\"10/30/2014\":3.3592,\"10/31/2014\":3.3459,\"11/03/2014\":3.3772,\"11/04/2014\":3.3776,\"11/05/2014\":3.3887,\"11/06/2014\":3.3769,\"11/07/2014\":3.4084,\"11/10/2014\":3.3765,\"11/12/2014\":3.3966,\"11/13/2014\":3.386,\"11/14/2014\":3.3933,\"11/17/2014\":3.3819,\"11/18/2014\":3.3706,\"11/19/2014\":3.3655,\"11/20/2014\":3.368,\"11/21/2014\":3.3827,\"11/24/2014\":3.3842,\"11/25/2014\":3.3706,\"11/26/2014\":3.3546,\"11/27/2014\":3.3528,\"11/28/2014\":3.3605,\"12/01/2014\":3.3519,\"12/02/2014\":3.3466,\"12/03/2014\":3.373,\"12/04/2014\":3.3728,\"12/05/2014\":3.3619,\"12/08/2014\":3.3978,\"12/09/2014\":3.3688,\"12/10/2014\":3.3572,\"12/11/2014\":3.3611,\"12/12/2014\":3.3639,\"12/15/2014\":3.3621,\"12/16/2014\":3.3522,\"12/17/2014\":3.3928,\"12/18/2014\":3.4428,\"12/19/2014\":3.4791,\"12/22/2014\":3.4767,\"12/23/2014\":3.4937,\"12/24/2014\":3.529,\"12/29/2014\":3.527,\"12/30/2014\":3.5458,\"12/31/2014\":3.5072,\"01/02/2015\":3.5725,\"01/05/2015\":3.5975,\"01/07/2015\":3.6375,\"01/08/2015\":3.6482,\"01/09/2015\":3.6252,\"01/12/2015\":3.6218,\"01/13/2015\":3.6252,\"01/14/2015\":3.6525,\"01/15/2015\":3.6588,\"01/16/2015\":3.7174,\"01/19/2015\":3.7176,\"01/20/2015\":3.7346,\"01/21/2015\":3.7358,\"01/22/2015\":3.6994,\"01/23/2015\":3.7687,\"01/26/2015\":3.7601,\"01/27/2015\":3.7348,\"01/28/2015\":3.7276,\"01/29/2015\":3.7418,\"01/30/2015\":3.7204,\"02/02/2015\":3.6801,\"02/03/2015\":3.6886,\"02/04/2015\":3.644,\"02/05/2015\":3.6656,\"02/06/2015\":3.6395,\"02/09/2015\":3.6811,\"02/10/2015\":3.722,\"02/11/2015\":3.7094,\"02/12/2015\":3.6926,\"02/13/2015\":3.6552,\"02/16/2015\":3.6665,\"02/17/2015\":3.6788,\"02/18/2015\":3.6784,\"02/19/2015\":3.6631,\"02/20/2015\":3.6895,\"02/23/2015\":3.6933,\"02/24/2015\":3.6948,\"02/25/2015\":3.6649,\"02/26/2015\":3.6519,\"02/27/2015\":3.698,\"03/02/2015\":3.7053,\"03/03/2015\":3.719,\"03/04/2015\":3.7485,\"03/05/2015\":3.7525,\"03/06/2015\":3.7649,\"03/09/2015\":3.789,\"03/10/2015\":3.8345,\"03/11/2015\":3.9091,\"03/12/2015\":3.8928,\"03/13/2015\":3.9141,\"03/16/2015\":3.926,\"03/17/2015\":3.9034,\"03/18/2015\":3.9073,\"03/19/2015\":3.8596,\"03/20/2015\":3.8645,\"03/23/2015\":3.818,\"03/24/2015\":3.7453,\"03/25/2015\":3.7355,\"03/26/2015\":3.705,\"03/27/2015\":3.789,\"03/30/2015\":3.7685,\"03/31/2015\":3.8125,\"04/01/2015\":3.789,\"04/02/2015\":3.7524,\"04/03/2015\":3.7449,\"04/07/2015\":3.7435,\"04/08/2015\":3.7135,\"04/09/2015\":3.7414,\"04/10/2015\":3.7894,\"04/13/2015\":3.8088,\"04/14/2015\":3.8001,\"04/15/2015\":3.7875,\"04/16/2015\":3.7746,\"04/17/2015\":3.7277,\"04/20/2015\":3.7302,\"04/21/2015\":3.7275,\"04/22/2015\":3.7125,\"04/23/2015\":3.7371,\"04/24/2015\":3.6895,\"04/27/2015\":3.7115,\"04/28/2015\":3.6751,\"04/29/2015\":3.6396,\"04/30/2015\":3.5987,\"05/04/2015\":3.632,\"05/05/2015\":3.6205,\"05/06/2015\":3.6116,\"05/07/2015\":3.583,\"05/08/2015\":3.6095,\"05/11/2015\":3.6489,\"05/12/2015\":3.6447,\"05/13/2015\":3.63,\"05/14/2015\":3.5921,\"05/15/2015\":3.5719,\"05/18/2015\":3.555,\"05/19/2015\":3.6152,\"05/20/2015\":3.6538,\"05/21/2015\":3.6605,\"05/22/2015\":3.669,\"05/25/2015\":3.75,\"05/26/2015\":3.7898,\"05/27/2015\":3.7906,\"05/28/2015\":3.7858,\"05/29/2015\":3.7671,\"06/01/2015\":3.785,\"06/02/2015\":3.7676,\"06/03/2015\":3.7108,\"06/05/2015\":3.6949,\"06/08/2015\":3.7381,\"06/09/2015\":3.6975,\"06/10/2015\":3.676,\"06/11/2015\":3.6817,\"06/12/2015\":3.7094,\"06/15/2015\":3.6905,\"06/16/2015\":3.6933,\"06/17/2015\":3.6873,\"06/18/2015\":3.6556,\"06/19/2015\":3.6879,\"06/22/2015\":3.6799,\"06/23/2015\":3.704,\"06/24/2015\":3.7103,\"06/25/2015\":3.7305,\"06/26/2015\":3.7275,\"06/29/2015\":3.7671,\"06/30/2015\":3.7645,\"07/01/2015\":3.7625,\"07/02/2015\":3.7859,\"07/03/2015\":3.7726,\"07/06/2015\":3.796,\"07/07/2015\":3.8313,\"07/08/2015\":3.8225,\"07/09/2015\":3.829,\"07/10/2015\":3.7709,\"07/13/2015\":3.7543,\"07/14/2015\":3.7645,\"07/15/2015\":3.747,\"07/16/2015\":3.7694,\"07/17/2015\":3.7676,\"07/20/2015\":3.7868,\"07/21/2015\":3.7875,\"07/22/2015\":3.7629,\"07/23/2015\":3.7559,\"07/24/2015\":3.7654,\"07/27/2015\":3.7455,\"07/28/2015\":3.7303,\"07/29/2015\":3.7471,\"07/30/2015\":3.7754,\"07/31/2015\":3.7929,\"08/03/2015\":3.7705,\"08/04/2015\":3.7792,\"08/05/2015\":3.8359,\"08/06/2015\":3.8385,\"08/07/2015\":3.8326,\"08/10/2015\":3.8246,\"08/11/2015\":3.8087,\"08/12/2015\":3.7805,\"08/13/2015\":3.7625,\"08/14/2015\":3.7557,\"08/17/2015\":3.7613,\"08/18/2015\":3.7578,\"08/19/2015\":3.7718,\"08/20/2015\":3.7659,\"08/21/2015\":3.7308,\"08/24/2015\":3.6971,\"08/25/2015\":3.6613,\"08/26/2015\":3.6937,\"08/27/2015\":3.745,\"08/28/2015\":3.7493,\"08/31/2015\":3.778,\"09/01/2015\":3.7503,\"09/02/2015\":3.7626,\"09/03/2015\":3.7645,\"09/04/2015\":3.7952,\"09/07/2015\":3.7928,\"09/08/2015\":3.7878,\"09/09/2015\":3.7634,\"09/10/2015\":3.7648,\"09/11/2015\":3.7264,\"09/14/2015\":3.7124,\"09/15/2015\":3.7238,\"09/16/2015\":3.7315,\"09/17/2015\":3.7129,\"09/18/2015\":3.6738,\"09/21/2015\":3.708,\"09/22/2015\":3.7438,\"09/23/2015\":3.7801,\"09/24/2015\":3.7687,\"09/25/2015\":3.7818,\"09/28/2015\":3.7861,\"09/29/2015\":3.7799,\"09/30/2015\":3.7754,\"10/01/2015\":3.8005,\"10/02/2015\":3.8028,\"10/05/2015\":3.773,\"10/06/2015\":3.789,\"10/07/2015\":3.7604,\"10/08/2015\":3.7543,\"10/09/2015\":3.7242,\"10/12/2015\":3.7148,\"10/13/2015\":3.7199,\"10/14/2015\":3.7129,\"10/15/2015\":3.6948,\"10/16/2015\":3.7243,\"10/19/2015\":3.7265,\"10/20/2015\":3.7385,\"10/21/2015\":3.7627,\"10/22/2015\":3.7806,\"10/23/2015\":3.82,\"10/26/2015\":3.8645,\"10/27/2015\":3.8669,\"10/28/2015\":3.8826,\"10/29/2015\":3.8974,\"10/30/2015\":3.8748,\"11/02/2015\":3.859,\"11/03/2015\":3.8678,\"11/04/2015\":3.8876,\"11/05/2015\":3.8925,\"11/06/2015\":3.9075,\"11/09/2015\":3.9605,\"11/10/2015\":3.957,\"11/12/2015\":3.9434,\"11/13/2015\":3.9388,\"11/16/2015\":3.9581,\"11/17/2015\":3.9775,\"11/18/2015\":3.9802,\"11/19/2015\":3.9754,\"11/20/2015\":3.9706,\"11/23/2015\":3.988,\"11/24/2015\":4.0021,\"11/25/2015\":4.0215,\"11/26/2015\":4.0298,\"11/27/2015\":4.0333,\"11/30/2015\":4.0304,\"12/01/2015\":4.0248,\"12/02/2015\":4.0305,\"12/03/2015\":4.04,\"12/04/2015\":3.9607,\"12/07/2015\":3.9853,\"12/08/2015\":3.9877,\"12/09/2015\":3.9705,\"12/10/2015\":3.9601,\"12/11/2015\":3.9718,\"12/14/2015\":3.9695,\"12/15/2015\":3.9523,\"12/16/2015\":3.9644,\"12/17/2015\":3.9646,\"12/18/2015\":3.9558,\"12/21/2015\":3.92,\"12/22/2015\":3.8787,\"12/23/2015\":3.8872,\"12/24/2015\":3.8695,\"12/28/2015\":3.8663,\"12/29/2015\":3.8659,\"12/30/2015\":3.8801,\"12/31/2015\":3.9011}')
	
	const padNumber = number => number < 10 ? '0' + number : number

	const getCurrencyDateString = date => padNumber((date.getMonth() + 1)) + '/' + padNumber(date.getDate()) + '/' + date.getFullYear()

	const getURLDateString = date => date.getFullYear() + '-' + padNumber(date.getDate()) + '-' + padNumber((date.getMonth() + 1))

	const parseDollars = dollars => dollars.replace('$', '').replace(/,/g, '')

	const moveOneDayBack = date => {
		date.setDate(date.getDate() - 1)
		return date
	}

	const getRateForTradeDateString = tradeDateString => {
		let tradeDate = new Date(tradeDateString)
		let tries = 0
		let rate

		while (!rate && tries < 3) {
			moveOneDayBack(tradeDate)
			tries++
			rate = CURRENCY_VALUES[getCurrencyDateString(tradeDate)]
		}

		return rate
	}

	const filterResponseGarbage = response => response.substr(response.indexOf('{'))

	const getXsrfToken = () => 
		document.cookie
			.split(';')
			.filter((cookie) => cookie.indexOf('XSRF-TOKEN') !== -1)
			.pop()
			.split('=')
			.pop()

	const processReleases = (releases) => {
		let partials = releases
			.map(release => {
				let shareUnits = Number(release.shares)
				let shareValue = Number(parseDollars(release.salePrice))
				let totalUSD = shareUnits * shareValue
				let exchangeRate = getRateForTradeDateString(release.tradeDate)

				return {
					tradeDate: release.tradeDate,
					shareUnits: shareUnits,
					shareValue: shareValue,
					totalUSD: totalUSD,
					exchangeRate: exchangeRate,
					totalPLN: totalUSD * exchangeRate
				}
			})

		let totalReleaseEarned = partials
			.reduce((previous, current) => previous + current.totalPLN, 0)

		if (console.table) {
			console.log('%crelease details:', 'color: blue')
			console.table(partials)
		}
		console.log(`%creleases total is %c${totalReleaseEarned.toFixed(2)} PLN`, 'color: blue', 'color: red')
		console.log('%cyou may want to put that into PIT/ZG p. 24 and PIT-36 p. 85 p. 136', 'color: blue')
	}

	const processDividends = (dividends) => {
		let partials = dividends
			.map(dividend => {
				let netCashProceeds = Number(parseDollars(dividend.netCashProceeds))
				let exchangeRate = getRateForTradeDateString(dividend.tradeDate)
				
				return {
					tradeDate: dividend.tradeDate,
					netCashProceeds: netCashProceeds,
					exchangeRate: exchangeRate,
					totalPLN: netCashProceeds * exchangeRate
				}
			})

		let totalDividendEarned = partials
			.reduce((previous, current) => previous + current.totalPLN, 0)

		if (console.table) {
			console.log('%cdividend details:', 'color: brown')
			console.table(partials)
		}
		console.log(`%c19% of dividends total is %c${(totalDividendEarned * 0.19).toFixed(2)} PLN`, 'color: brown', 'color: red')
		console.log('%cyou may want to put that into PIT-38 p. 37. Alternatively PIT-36 p. 212, if you don\'t need PIT-38', 'color: brown')
	}

	const processWithholdings = (withholdings) => {
		let partials = withholdings
			.map(withholding => {
				let netCashProceeds = Number(parseDollars(withholding.netCashProceeds))
				let exchangeRate = getRateForTradeDateString(withholding.tradeDate)
				
				return {
					tradeDate: withholding.tradeDate,
					netCashProceeds: netCashProceeds,
					exchangeRate: exchangeRate,
					totalPLN: netCashProceeds * exchangeRate
				}
			})

		let totalWithholdings = partials
			.reduce((previous, current) => previous + current.totalPLN, 0)

		if (console.table) {
			console.log('%cdividend withholding details:', 'color: darkgreen')
			console.table(partials)
		}
		console.log(`%cdividend witholdings total is %c${totalWithholdings.toFixed(2)} PLN`, 'color: darkgreen', 'color: red')
		console.log('%cyou may want to put that into PIT-38 p. 38. Alternatively PIT-36 p. 214, if you don\'t need PIT-38', 'color: darkgreen')
	}

	const processSale = (sale) => {
		let orderDate = getURLDateString(new Date(sale.orderDate))
		return fetch(`${JSON_BASE}/transaction/details/${COMPANY_ID}/${PLAN_ID}/K?orderDate=${orderDate}&orderNumber=${sale.orderNumber}&segmentId=${sale.segmentId}&fromOrder=closedOrder&format=json`, {
				credentials: 'include',
				headers: new Headers({
					'X-XSRF-TOKEN': getXsrfToken()
				})	
			})
			.then(response => response.text())
			.then(text => {
				let data = JSON.parse(filterResponseGarbage(text))
				let proceedDetails = data.proceedsDetails.dataSet.DATA.pop()
				let orderDetail = data.orderDetail.dataSet.DATA.pop()
				let rate = getRateForTradeDateString(orderDetail.trxTradeDate)
				let sellValue = Number(parseDollars(proceedDetails.grossProceeds)) * rate
				let transactionCost = Number(parseDollars(proceedDetails.totalFees)) * rate
				let buyCosts = data.shareLots.dataSet.DATA.reduce((previous, current) => {
					return previous + Number(current.sharesSold) * Number(parseDollars(current.acquiredPrice)) * getRateForTradeDateString(current.acquiredDate)
				}, 0)

				return {
					tradeDate: orderDetail.trxTradeDate,
					sellValue: sellValue,
					exchangeRate: rate,
					transactionCost: transactionCost,
					buyCosts: buyCosts,
					totalCost: buyCosts + transactionCost,
					profit: sellValue - buyCosts - transactionCost,
					buyTransactions: data.shareLots.dataSet.DATA
				}
			})
	}

	fetch(`${JSON_BASE}/transactions/${COMPANY_ID}/K/${PLAN_ID}/duration/between/${PERIOD_START}/${PERIOD_END}?format=json`, {
			credentials: 'include',
			headers: new Headers({
				'X-XSRF-TOKEN': getXsrfToken()
			})
		})
		.then(response => response.text())
		.then(text => {
			let data = JSON.parse(filterResponseGarbage(text))
			let records = data.closedOrders.dataSet.DATA
			let sales = records.filter((record) => record.transactionType === 'Sale')

			processReleases(records.filter((record) => record.transactionType === 'Release'))
			processDividends(records.filter((record) => record.transactionType === 'Dividend Credit'))
			processWithholdings(records.filter((record) => record.transactionType === 'IRS Withholding'))
			
			if (!sales.length) {
				console.log('%cno sales found ~ FIN ~', 'color: green')
			} else {
				console.log(`%cprocessing ${sales.length} sale records...`, 'color: green')
				Promise.all(sales.map(processSale))
					.then(sales => {
						if (console.table) {
							console.log('%csale details:', 'color: darkorange')
							console.table(sales, ['tradeDate','sellValue','exchangeRate','transactionCost','buyCosts','totalCost','profit'])
							console.log('%csale details breakdowns:', 'color: darkorange')
							sales.forEach((sale, index) => {
								console.log(`%csale ${index + 1} related buy transactions`, 'color: darkorange')
								console.table(sale.buyTransactions.map((transaction) => {
									let acquiredPrice = Number(parseDollars(transaction.acquiredPrice))
									let sharesSold = Number(transaction.sharesSold)
									let exchangeRate = getRateForTradeDateString(transaction.acquiredDate)

									return {
										tradeDate: transaction.acquiredDate,
										sharesSold: sharesSold,
										acquiredPrice: acquiredPrice,
										exchangeRate: exchangeRate,
										acquiredPLN: sharesSold * acquiredPrice * exchangeRate
									}
								}))
							})
						}
						let totalSellValue = sales.reduce((previous, current) => previous + current.sellValue, 0)
						let totalCost = sales.reduce((previous, current) => previous + current.totalCost, 0)
						let totalProfit = sales.reduce((previous, current) => previous + current.profit, 0)

						console.log('%csells grand totals:', 'color: darkorange')
						console.log(`%csells total value is %c${totalSellValue.toFixed(2)} PLN`, 'color: darkorange', 'color: red')
						console.log('%cyou may want to put that into PIT-38 p. 22', 'color: darkorange')
						console.log(`%csells total cost is %c${totalCost.toFixed(2)} PLN`, 'color: darkorange', 'color: red')
						console.log('%cyou may want to put that into PIT-38 p. 23', 'color: darkorange')
						console.log(`%csells total profit is %c${totalProfit.toFixed(2)} PLN`, 'color: darkorange', 'color: red')
						console.log('%cyou may want to put that into PIT/ZG p. 31', 'color: darkorange')
						console.log('%call done ~ FIN ~', 'color: green')
					})
			}
		})
		.catch(error => console.log('ups!, ' + error))
})()