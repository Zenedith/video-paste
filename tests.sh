#!/bin/bash
mocha -R list -u exports test/app-test.js test/getSession.js test/login.js test/getLinksByTag.js test/getTopLinks.js test/getTags.js test/getNewLinks.js test/profile.js test/postLink.js test/postViews.js test/postRate.js
exit 0