![Logo](img/logo.png "Logo")

**[↤ Developer Overview](../README.md#developer-overview)**

`a11y-audit auth`
---

Some websites are protected from viewing by Basic HTTP Authentication. In order to run accessibility tests on these protected websites, you will need to configure tests with authentication data.

However, you might not want to put a `username` and `password` in your config file. Use this command to generate a token that will keep your info secure.

```bash
a11y-audit auth
```

This command will generate a token that looks like this:  `bWVAZW1haWwuY29tOmFiYzEyMw==`.  Below are two different ways to add authentication data.

#### SAMPLE USE:

Sample Usage: `/path/to/my/config.json`

**Root Level:** Use this method if all your tests have the same authentication.

```json
{
  "format": "md",
  "notices": false,
  "warnings": false,
  "output": "/path/to/my/report",
  "auth": {
    "token": "bWVAZW1haWwuY29tOmFiYzEyMw=="
  },
  "tests": [
    {
      "url": "https://mywebsite.com"
    }
  ]
}
```

**Per Test:** Use this method if each of your tests have different authentication.

```json
{
  "format": "md",
  "notices": false,
  "warnings": false,
  "output": "/path/to/my/report",
  "tests": [
    {
      "url": "https://mywebsite.com",
      "auth": {
        "token": "bWVAZW1haWwuY29tOmFiYzEyMw=="
      }
    }
  ]
}
