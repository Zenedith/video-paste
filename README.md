# Available api helpers

- GET /debug/requests
    ```
    request and response live debugger
    ```

# Available tasks

- GET /task/checkNewList
    ```
    cleaning older posts from new list
    ```

# Available api methods

- GET /api/getSession/:apiKey
    ```
    get session for unauthorized user
    ```
    ```
    {
      sess: string, 
      userId: int
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY

- POST /api/loginByFb/:apiKey
    ```
    get session for authorized user by facebook
    ```
    ```
    POST JSON: data={id: string, name: string, fist_name: string, last_name: string, locale: string}
    ```
    ```
    {
      sess: string, 
      userId: int
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_LOGIN_FAILED

- POST /api/loginByGoogle/:apiKey
    ```
    get session for authorized user by google
    ```
    ```
    POST JSON: data={id: string, name: string, given_name: string, family_name: string}
    ```
    ```
    {
      sess: string, 
      userId: int
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_LOGIN_FAILED

- POST /api/loginByTwitter/:apiKey
    ```
    get session for authorized user by twitter
    ```
    ```
    POST JSON: data={id: string, name: string}
    ```
    ```
    {
      sess: string, 
      userId: int
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_LOGIN_FAILED

- POST /api/loginByWindowsLive/:apiKey
    ```
    get session for authorized user by windows live
    ```
    ```
    POST JSON: data={id: string, name: string, fist_name: string, last_name: string, locale: string}
    ```
    ```
    {
      sess: string, 
      userId: int
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_LOGIN_FAILED

- GET /api/generateKey
    ```
    generate valid key (temp)
    ```
    ```
    {
      key: string
    }
    ```
- GET /api/postLink/:sessionId/:postId
    ```
    get posted link data by postId
    ```
    ```
    { 
      postId: int,  
      added: int, 
      userId: int, 
      userName: string, 
      videoInfo: {
        url: string, 
        title: string, 
        description: string, 
        thumbUrl: string, 
        explicit: boolean
      }, 
      rate: int, 
      views: int, 
      tags: [
        tagName: string
      ] 
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
- POST /api/postLink/:sessionId
    ```
    create post link
    ```
    ```
    POST JSON: data={url: string, tags: [tagName: string]}
    ```
    ```
    { 
      postId: int, 
      added: int, 
      userId: int, 
      userName: string, 
      videoInfo: {
        url: string, 
        title: string, 
        description: string, 
        thumbUrl: string, 
        explicit: boolean
      }, 
      rate: int, 
      views: int, 
      tags: [
        tagName: string
      ] 
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_INVALID_TAG_NAME
    * ERR_UNAUTHORIZED
- POST /api/postViews/:sessionId/:postId
    ```
    increse post link views count
    ```
    ```
    POST JSON: data={}
    ```
    ```
    { 
      postId: int, 
      views: int
    }
    ```

    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
- POST /api/postRate/:sessionId/:postId
    ```
    rate post link (rate [-1, 1])
    ```
    ```
    POST JSON: data={rate: int}
    ```
    ```
    { 
      postId: int, 
      rate: int 
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_UNAUTHORIZED
    * ERR_ALREADY_RATED
- GET /api/getTopLinks/:sessionId/:categoryId/:limit/:page
    ```
    get top links (only sessionId is required, max limit value: 100)
    ```
    ```
    {
      count: int, 
      pages: int, 
      currentPage: int, 
      isNextPage: bool, 
      isPrevPage: bool, 
      result: [{ 
        postId: int,  
        added: int, 
        userId: int, 
        userName: string, 
        videoInfo: {
          url: string, 
          title: string, 
          description: string, 
          thumbUrl: string, 
          explicit: boolean
        }, 
        rate: int, 
        views: int, 
        tags: [
          tagName: string
        ]
      }]
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_EMPTY_RESULTS
- GET /api/getTags/:apiKey/:limit/:page/:searchKey
    ```
    get tags (searchKey tag is optional, max limit value: 100)
    ```
    ```
    {
      count: int, 
      pages: int, 
      currentPage: int, 
      isNextPage: bool, 
      isPrevPage: bool, 
      result: [
        tagName:string
      ]
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
- GET /api/getNewLinks/:sessionId/:limit/:page
    ```
    get new links ordered from newer to older (only sessionId is required, max limit value: 100)
    ```
    ```
    {
      count: int, 
      pages: int, 
      currentPage: int, 
      isNextPage: bool, 
      isPrevPage: bool, 
      result: [{ 
        postId: int, 
        added: int, 
        userId: int, 
        userName: string, 
        videoInfo: {
          url: string, 
          title: string, 
          description: string, 
          thumbUrl: string, 
          explicit: boolean
        }, 
        rate: int, 
        views: int, 
        tags: [
          tagName: string
        ]
      }]
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_EMPTY_RESULTS
- GET /api/getLinksByTag/:sessionId/:tagName/:limit/:page
    ```
    get links by given tag name, ordered from newer to older (only sessionId is required, max limit value: 100)
    ```
    ```
    {
      count: int, 
      pages: int, 
      currentPage: int, 
      isNextPage: bool, 
      isPrevPage: bool, 
      result: [{ 
        postId: int,  
        added: int, 
        userId: int, 
        userName: string, 
        videoInfo: {
          url: string, 
          title: string, 
          description: string, 
          thumbUrl: string, 
          explicit: boolean
        }, 
        rate: int, 
        views: int, 
        tags: [
          tagName: string
        ]
      }]
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_EMPTY_RESULTS
- GET /api/profile/:sessionId/:userId
    ```
    get given user profile (userId is optional)
    ```
    ```
    {
      userId: int, 
      name: string, 
      fistName: string, 
      lastName: string, 
      accountType: string, 
      topPosts: [ 
      ]
    }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_UNAUTHORIZED
    * ERR_INVALID_USER_ID

# Error handling

```
{
 error: string,
 data: string,
 code: int,
 msg: string
}
```

```
error value             code value
* ERR_BAD_REQUEST           400
* ERR_UNAUTHORIZED          401
* ERR_NOT_ALLOWED           403
* ERR_NOT_FOUND             404
* ERR_METHOD_NOT_ALLOWED    405
* ERR_API_INTERNAL_ERROR    50x
* ERR_EMPTY_RESULTS         601
* ERR_INVALID_KEY           602
* ERR_INVALID_SESSION       603
* ERR_ALREADY_RATED         604
* ERR_LOGIN_FAILED          605
* ERR_INVALID_TAG_NAME      606
* ERR_INVALID_USER_ID       607
```