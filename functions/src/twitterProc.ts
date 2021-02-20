const Twitter = require('twitter')

module.exports = async (
  access_token_key: String,
  access_token_secret: String,
  id: String
) => {
  let twitter_credentials = require('./twitterCredentials')
  twitter_credentials = {
    ...twitter_credentials,
    access_token_key,
    access_token_secret,
  }
  try {
    const client = new Twitter(twitter_credentials)
    const response = await client.get('friendships/lookup', {
      user_id: id,
    })
    console.log(response)
    if (
      response[0].connections.includes('following') &&
      response[0].connections.includes('followed_by')
    ) {
      return true
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  return false
}
