if (!process.env.APP_PATH) {
    process.env.APP_PATH = __dirname + '/..';
}

process.env.TESTER = 'mocha';

var
    server = require(process.env.APP_PATH + '/server');

var Tester = (function () {
    var
        showResponse = true,
        searchByTag = 'alfa',
        apikey = '6254b715bcc5d680',
        authUserId = 0,
        authSessId = '',
        sessId = '',
        viewsPostId = 0,
        viewsCount = 0,
        createdPostId = 0,
        ratePostValue = 0,
        ratePostId = 0;

    return {
        canShowResponse: function () {
            return showResponse;
        },
        getSearchTag: function () {
            return searchByTag;
        },
        getApiKey: function () {
            if (!apikey) {
                throw new Error('Tester: no apikey defined');
            }

            return apikey;
        },
        getSession: function () {

            if (!sessId) {
                throw new Error('Tester: no sessId defined');
            }

            return sessId;
        },
        getAuthSession: function () {
            if (!authSessId) {
                throw new Error('Tester: no authSessId defined');
            }

            return authSessId;
        },
        getAuthUserId: function () {
            if (!authUserId) {
                throw new Error('Tester: no authUserId defined');
            }

            return authUserId;
        },
        getAppVhost: function () {
            return server.app;
        },
        getApiVhost: function () {
            return server.api;
        },
        getPostViewsCount: function () {
            return viewsCount;
        },
        getPostViewsId: function () {
            if (!viewsPostId) {
                throw new Error('Tester: no viewsPostId defined');
            }

            return viewsPostId;
        },
        getCreatedPostId: function () {
            if (!createdPostId) {
                throw new Error('Tester: no createdPostId defined');
            }

            return createdPostId;
        },
        getRatePostId: function () {
            if (!ratePostId) {
                throw new Error('Tester: no ratePostId defined');
            }

            return ratePostId;
        },
        getRatePostValue: function () {
            if (!ratePostValue) {
                throw new Error('Tester: no ratePostValue defined');
            }

            return ratePostValue;
        },

        setCreatedPostId: function (newPostId) {
            if (!createdPostId) {
                createdPostId = newPostId;
            }
        },
        setPostToIncreaseViews: function (newViewsPostId, newViewsCount) {
            if (!viewsPostId) {
                viewsPostId = newViewsPostId;
            }

            if (!viewsCount) {
                viewsCount = newViewsCount;
            }
        },
        setPostToRate: function (newRatePostId, newRateCount, force) {
            if (!ratePostId || force) {
                ratePostId = newRatePostId;
            }

            if (!ratePostValue || force) {
                ratePostValue = newRateCount;
            }
        },
        setSession: function (newSessId) {
            if (!sessId) {
                sessId = newSessId;
            }
        },
        setApiKey: function (newApiKey, force) {
            if (!sessId || force) {
                apikey = newApiKey;
            }
        },
        setAuthUser: function (newSessId, newUserId) {
            if (!authSessId) {
                authSessId = newSessId;
            }

            if (!authUserId) {
                authUserId = newUserId;
            }
        }
    }
})();


exports.Tester = Tester;