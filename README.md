# GitHub OAuth App access token serverless solution 

![Build and Deploy to Cloud Functions](https://github.com/gitaction/upload-file-to-github/workflows/Build%20and%20Deploy%20to%20Cloud%20Functions/badge.svg)

Upload files to GitHub Repo


## Development

1.  Install dependence

    ```shell script
    $ yarn install
    ```
    
1.  Run tests

    ```shell script
    $ yarn test
    ```

1.  Run Cloud Functions on your local environment:

    ```shell script
    # Create `.env` file to store your environment variables, template shows below
    CLIENT_ID=xxxxxxxx
    CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    
    $ yarn start
    ```
   
[actions]: https://help.github.com/en/categories/automating-your-workflow-with-github-actions
[cloud-functions]: https://cloud.google.com/functions
[create-sa]: https://cloud.google.com/iam/docs/creating-managing-service-accounts
[create-key]: https://cloud.google.com/iam/docs/creating-managing-service-account-keys
[sdk]: https://cloud.google.com/sdk
[secrets]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets
[roles]: https://cloud.google.com/iam/docs/granting-roles-to-service-accounts#granting_access_to_a_service_account_for_a_resource
[github-oauth-apps]: https://developer.github.com/apps/building-oauth-apps/
[authorizing-oauth-apps]: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
