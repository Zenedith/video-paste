# Available api methods

- /api/getSession/:apiKey
    ```
    get session for unauthorized user
    ```
    ```
    {sess: string, userId: int}
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY

- /api/loginByFb/:apiKey/:id/:name/:fist_name/:last_name/:locale
    ```
    get session for authorized user by facebook
    ```
    ```
    {sess: string, userId: int}
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_LOGIN_FAILED

- /api/generateKey
    ```
    generate valid key (temp)
    ```
    ```
    {key: string}
    ```
- /api/postLink/:sessionId/:postId
    ```
    get posted link data by postId
    ```
    ```
    { postId: int, categoryId: int, added: int, userId: int, userName: string, url: string, thumbUrl: string, rate: int, views: int }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
- /api/postLink/:sessionId
    ```
    create post link (url param from POST BODY)
    ```
    ```
    { postId: int, categoryId: int, added: int, userId: int, userName: string, url: string, thumbUrl: string, rate: int, views: int }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_UNAUTHORIZED
- /api/postViews/:sessionId/:postId
    ```
    increse post link views count
    ```
    ```
    { postId: int, views: int }
    ```

    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
- /api/postRate/:sessionId/:postId
    ```
    rate post link (rate [-1, 1] param from POST BODY)
    ```
    ```
    { postId: int, rate: int }
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION
    * ERR_UNAUTHORIZED
    * ERR_ALREADY_RATED
- /api/getTopLinks/:sessionId/:categoryId/:limit/:page
    ```
    get top links (only sessionId is required, max limit value: 100)
    ```
    ```
    {count: int, pages: int, currentPage: int, isNextPage: bool, isPrevPage: bool, result: [{ postId: int, categoryId: int, added: int, userId: int, userName: string, url: string, thumbUrl: string, rate: int, views: int}]
    ```
    * ERR_BAD_REQUEST
    * ERR_API_INTERNAL_ERROR
    * ERR_INVALID_KEY
    * ERR_INVALID_SESSION

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
```