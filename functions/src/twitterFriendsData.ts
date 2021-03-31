module.exports = async (
  access_token_key: String,
  access_token_secret: String,
  firstCursor: Number,
  userId: String
) => {
  const Twitter = require('twitter')

  let twitter_credentials = require('./twitterCredentials')
  twitter_credentials = {
    ...twitter_credentials,
    access_token_key,
    access_token_secret,
  }
  try {
    const client = new Twitter(twitter_credentials)
    let cursor = firstCursor
    let json = { cursor: -1, friends: {} }
    let friends = {}

    for (let count = 0; count <= 10; count++) {
      const response = await client.get('friends/list', {
        user_id: userId,
        cursor,
        count: 200,
        skip_status: true,
      })

      json['cursor'] = response.next_cursor
      for (let i = 0; i < response['users'].length; i++) {
        //@ts-ignore
        friends[response['users'][i].id] = {
          name: response['users'][i].name,
          twitter: '@' + response['users'][i].screen_name,
        }
      }
      json['friends'] = friends
      cursor = response.next_cursor
      if (cursor === 0) break
    }
    return json
  } catch (err) {
    console.log(err)
    throw err
  }
}
