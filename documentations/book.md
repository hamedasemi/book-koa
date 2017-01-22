
# Book Web API v1.0

## Request

Make a request to the verses endpoint 

``` http
GET /verses HTTP/2.0

Content-Type: application/json
Content-Encoding: UTF-8

?

offset=10&
limit=20&

metadata&
metadata[order]&

translation=en&
translation[0][language]=english&
translation[1][language]=spanish&
original=simple&
original[0][language]=arabic&
original[0][type]=clear&
style
style[direction]

search[language]=english&
search[letter][]=e&
search[letter][]=d&
search[word]=go&
search[element]=&
search[sentence]=&

translation[][language]=english&
translation[][language]=spanish&
original[][language]=arabic&
original[][type]=clear&
style&
style[direction]
```

The query string JavaScript Object

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

## Response

The response is an Array of Objects

```json
[{
    "index": 1,
    "metadata": {
        "order": 10,
        "chapter": 2,
        "part": 8,
        "stage": 2,
        "section": 34,
        "page": 4
    },
    "translations": [{
        "style": {
            "direction": "rtl",
            "charset": "utf-8"
        },
        "language": "en",
        "context": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }, {
        "style": {
            "direction": "rtl",
            "charset": "utf-8"
        },
        "language": "fa",
        "context": "به نام خداوند بخشنده بخشایشگر" 
    }],
    "originals": [{
        "language": "ar",
        "type": "simple",
        "context": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"
    }]
}]
```