/* eslint-disable no-undef */
export const API_VERSION = 'v1'

export const BASE = process.env.REACT_APP_BASE
export const WS_BASE = process.env.REACT_APP_WS_BASE

export const LOGIN = '/user/login'
export const USER_BASE = '/user'
export const CREATE_USER = '/user'
export const SEND_VERIFICATION = '/user/send-verification-mail/'
export const VERIFY_MAIL = '/user/verify-mail/'
export const ALL_USER = '/user/all'
export const ALL_USER_PROFILE = '/user-profile/all'
export const USER_DETAIL = '/user/detail/'
export const USER_PLAN = '/user/plan/'

export const USER_SETTING = '/user-setting/'
export const CREATE_USER_SETTING = '/user-setting'
export const ALL_USER_SETTING = '/user-setting/all'

export const TRADE = '/trade/'
export const CREATE_TRADE = '/trade'
export const ALL_TRADE = '/trade/all'
export const ALL_TRADE_TRANSACTION = '/trade-transaction/all'

export const DEPOSIT = '/deposit'
export const GENERATE_DEPOSIT = '/deposit'

export const WITHDRAW = '/withdraw'
export const REQUEST_WITHDRAW = '/withdraw'

export const NETWORK = '/network/'
export const CREATE_NETWORK = '/network'
export const ALL_NETWORK = '/network/all'

export const COINS = '/coins/'
export const CREATE_COINS = '/coins'
export const ALL_COINS = '/coins/all'

export const PACKAGE = '/package/'
export const CREATE_PACKAGE = '/package'
export const ALL_PACKAGE = '/package/all'

export const EXCHANGER = '/exchanger/'
export const CREATE_EXCHANGER = '/exchanger'
export const ALL_EXCHANGER = '/exchanger/all'
export const ALL_EXCHANGER_TRANSACTION = '/exchanger-transaction/all'

export const OPTION = '/option/'
export const CREATE_OPTION = '/option'
export const ALL_OPTION = '/option/all'

export const DATA_STORE_GET = '/data-store/get/'

export const TOKEN = '/token/'
export const CREATE_TOKEN = '/token'
export const ALL_TOKEN = '/token/all'

export const TRANSACTION_TOKEN = '/transaction-token/'
export const CREATE_TRANSACTION_TOKEN = '/transaction-token'
export const ALL_TRANSACTION_TOKEN = '/transaction-token/all'

export const SIGNAL = '/signal/'
export const CREATE_SIGNAL = '/signal'
export const ALL_SIGNAL = '/signal/all'

export const SETTING_CATEGORY = '/setting-category/'
export const CREATE_SETTING_CATEGORY = '/setting-category'
export const ALL_SETTING_CATEGORY = '/setting-category/all'

export const SETTING = '/setting/'
export const CREATE_SETTING = '/setting'
export const ALL_SETTING = '/setting/all'

export const TRANSACTION = '/transaction/'
export const CREATE_TRANSACTION = '/transaction'
export const ALL_TRANSACTION = '/transaction/all'

export const ALL_COUNTRIE = '/countrie/all'

export const ALL_STATE = '/state/all'

export const TOKEN_NETWORK = TOKEN + 'network/'

export const LOGGED = '/user/logged'

export const WALLET = '/wallet'

export const WALLET_BALANCE = '/wallet/balance/'

export const UPDATE_TRANSACTION_HASH = '/transaction/hash'

export const USER_EXCHANGERS = '/user/exchangers/'
export const LOAD_EXCHANGER = '/exchanger-transaction'
export const CLEAR_EXCHANGER = '/exchanger-transaction/clear/'

export const CONFIRM_USER = '/wallet/confirm-user/'

export const TRANSFER = '/wallet/transfer'

export const DEFAULT_TOKEN = '/token/default'

export const PRIVATE_FILE = '/prf/'

export const REFERRAL_LEVEL = '/referral-level/'
export const CREATE_REFERRAL_LEVEL = '/referral-level'
export const ALL_REFERRAL_LEVEL = '/referral-level/all'

export const AUTO_TRADE_DURATION = '/auto-trade-duration/'
export const CREATE_AUTO_TRADE_DURATION = '/auto-trade-duration'
export const ALL_AUTO_TRADE_DURATION = '/auto-trade-duration/all'

export const AUTO_TRADE_PLAN = '/auto-trade-plan/'
export const CREATE_AUTO_TRADE_PLAN = '/auto-trade-plan'
export const ALL_AUTO_TRADE_PLAN = '/auto-trade-plan/all'

export const AUTO_TRADE_PLAN_TRANSACTION = '/auto-trade-plan-transaction/'
export const CREATE_AUTO_TRADE_PLAN_TRANSACTION = '/auto-trade-plan-transaction'
export const ALL_AUTO_TRADE_PLAN_TRANSACTION = '/auto-trade-plan-transaction/all'

export const AUTO_TRADE_SETTING = '/auto-trade-setting/'
export const CREATE_AUTO_TRADE_SETTING = '/auto-trade-setting'
export const ALL_AUTO_TRADE_SETTING = '/auto-trade-setting/all'

export const USER_AUTO_TRADE_SETTING = '/user-auto-trade-setting/'
export const CREATE_USER_AUTO_TRADE_SETTING = '/user-auto-trade-setting'
export const ALL_USER_AUTO_TRADE_SETTING = '/user-auto-trade-setting/all'

export const PROFIT_TRANSACTION = '/profit-wallet/'
export const CREATE_PROFIT_TRANSACTION = '/profit-wallet'
export const ALL_PROFIT_TRANSACTION = '/transaction/profit/all'

export const SALES_TRANSACTION = '/referral-earning-transaction/'
export const CREATE_SALES_TRANSACTION = '/referral-earning-transaction'
export const ALL_SALES_TRANSACTION = '/sales-wallet/all'

export const SYSTEM_REVENUE = '/system-revenue/'
export const CREATE_SYSTEM_REVENUE = '/system-revenue'
export const ALL_SYSTEM_REVENUE = '/system-revenue/all'

export const AUTOTRADE_PLAN_TRANSACTION = '/auto-trade-plan-transaction/'
export const CREATE_AUTOTRADE_PLAN_TRANSACTION = '/auto-trade-plan-transaction'
export const ALL_AUTOTRADE_PLAN_TRANSACTION = '/auto-trade-plan-transaction/all'

export const PUBLIC_OPTIONS = '/option/publics'

export const DATASTORE = '/data-store/'
export const DATA_COUNT = '/data-store/count/'
export const DATA_SUM = '/data-store/sum/'

export const BETSLIP = '/bet-slip/'
export const CREATE_BETSLIP = '/bet-slip'
export const ALL_BETSLIP = '/bet-slip/all'

export const ODD = '/odds/'
export const CREATE_ODD = '/odds'
export const ALL_ODD = '/odds/all'

export const MATCH = '/matches/'
export const CREATE_MATCH = '/matches'
export const ALL_MATCH = '/matches/all'

export const LEAGUE = '/leagues/'
export const CREATE_LEAGUE = '/leagues'
export const ALL_LEAGUE = '/leagues/all'

export const PREDICTION = '/predictions/'
export const CREATE_PREDICTION = '/predictions'
export const ALL_PREDICTION = '/predictions/all'

export const MIGRATION = '/migration/'
export const MIGRATION_NAMES = '/migration/names'
export const CREATE_MIGRATION = '/migration'
export const ALL_MIGRATION = '/migration/all'

//Hotel Management
export const ROOM = '/room/'
export const CREATE_ROOM = '/room'
export const ALL_ROOM = '/room/all'

export const CUSTOMER = '/customer/'
export const CREATE_CUSTOMER = '/customer'
export const ALL_CUSTOMER = '/customer/all'

export const RECEIPT = '/receipt/'
export const CREATE_RECEIPT = '/receipt'
export const ALL_RECEIPT = '/receipt/all'

export const ROOMCATEGORY = '/room-category/'
export const CREATE_ROOMCATEGORY = '/room-category'
export const ALL_ROOMCATEGORY = '/room-category/all'

export const INVENTORY = '/inventory/'
export const CREATE_INVENTORY = '/inventory'
export const ALL_INVENTORY = '/inventory/all'

export const REFERRAL_COMMISSION = '/referral-commission/'
export const CREATE_REFERRAL_COMMISSION = '/referral-commission'
export const ALL_REFERRAL_COMMISSION = '/referral-commission/all'

export const LOG = '/log/'
export const CREATE_LOG = '/log'
export const ALL_LOG = '/log/all'
