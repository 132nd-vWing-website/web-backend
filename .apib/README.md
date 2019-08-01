FORMAT: 1A

# Polls

Polls is a simple APA allowing consumers to view polls and vote in them

# Group Questions

Resources related to questions in the API

## Question Collection [/questions]

### List All Questions [GET]
  + Response 200 (application/json)

          [
              {
                  "question": "Favourite programming language?",
                  "published_at": "2014-11-11T08:40:51.620Z",
                  "url": "/questions/1",
                  "choices": [
                      {
                          "choice": "Swift",
                          "url": "/questions/1/choices/1",
                          "votes": 2048
                      }, {
                          "choice": "Python",
                          "url": "/questions/1/choices/2",
                          "votes": 1024
                      }, {
                          "choice": "Objective-C",
                          "url": "/questions/1/choices/3",
                          "votes": 512
                      }, {
                          "choice": "Ruby",
                          "url": "/questions/1/choices/4",
                          "votes": 256
                      }
                  ]
              }
          ]

### Create a New Question [POST]
You may create your own question using this action. It takes a JSON object
containing a question and a collection of answers in the form of choices.

+ Request (application/json)

    + Attributes
    
        + question: Favourite Language? (required)
        + choices: Swift, `Objective-C` (array, required)

    + Body

            {
              "question": "Favourite language?"
              "choices": [
                "Swift",
                "Objective-C"
              ]
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "question": {
                  "type": "string"
                },
                "choices": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 2
                }
              }
            }

+ Response 201 (application/json)

    + Headers

            Location: /questions/1

    + Body

                {
                    "question": "Favourite programming language?",
                    "published_at": "2014-11-11T08:40:51.620Z",
                    "url": "/questions/1",
                    "choices": [
                        {
                            "choice": "Swift",
                            "url": "/questions/1/choices/1",
                            "votes": 0
                        }, {
                            "choice": "Python",
                            "url": "/questions/1/choices/2",
                            "votes": 0
                        }, {
                            "choice": "Objective-C",
                            "url": "/questions/1/choices/3",
                            "votes": 0
                        }, {
                            "choice": "Ruby",
                            "url": "/questions/1/choices/4",
                            "votes": 0
                        }
                    ]
                }

## Question [/questions/{question_id}]

  + Parameters
      + question_id (number) - ID of the Question as an integer

### View a Questions Detail [GET]

  + Response 200 (application/json)

              {
                  "question": "Favourite programming language?",
                  "published_at": "2014-11-11T08:40:51.620Z",
                  "url": "/questions/1",
                  "choices": [
                      {
                          "choice": "Swift",
                          "url": "/questions/1/choices/1",
                          "votes": 2048
                      }, {
                          "choice": "Python",
                          "url": "/questions/1/choices/2",
                          "votes": 1024
                      }, {
                          "choice": "Objective-C",
                          "url": "/questions/1/choices/3",
                          "votes": 512
                      }, {
                          "choice": "Ruby",
                          "url": "/questions/1/choices/4",
                          "votes": 256
                      }
                  ]
              }

### Delete [DELETE]

  + Response 204