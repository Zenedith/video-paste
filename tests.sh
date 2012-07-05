#!/bin/bash
mocha -R list -u exports test/app-test.js test/generateKey.js test/getSession.js test/login.js test/postLink.js test/getLinksByTag.js test/getTopLinks.js test/getTags.js test/getNewLinks.js test/profile.js test/postViews.js test/postRate.js
#mocha -R list -u exports test/getSession.js test/login.js test/postLink.js 
exit 0