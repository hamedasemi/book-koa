
# Book Web API

### Request

``` http
GET /verse HTTP/2.0
Content-Type: application/json
Content-Encoding: UTF-8
```
``` JavaScript
{
    offset: 10,
    limit: 20,
    search: {
        language: "english"
        letter: ['e', 'd'],
        word: ['go'],
        element: ['go', 'school'],
        sentence: ['go to school']
    },
    metadata: {
        order: 10
    },
    original: [{
        language: "persian",
        type: "clear",
    }],
    translation: [{
        language: "english",
    }, {
        language: "spanish"
    }]
}
```
### Response

``` http
GET /verse HTTP/2.0
Content-Type: application/json
Content-Encoding: UTF-8
```

```JavaScript
versus: [{
    index: 1,
    metadata: {
        order: 10,
        chapter: 2,
        part: 8,
        stage: 2,
        section: 34,
        page: 4
    },
    original: [{
        language: "persian",
        type: "clear",
        context: "Fortune favors the bold."
    }],
    translation: [{
        language: "english",
        context: "Fortune favors the bold."
    }, {
        language: "spanish",
        context: "La suerte protege a los audaces."
    }]
}]
```

