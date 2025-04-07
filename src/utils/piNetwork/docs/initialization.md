
# Initialization

Add the following `script` tags to all pages where you need to call the Pi Apps SDK:

```html
<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script>
  Pi.init({ version: "2.0" });
</script>
```

The config object passed to the init function accepts the following keys:

- `version` (string, required) - this is required to ensure compatibility of your app with newer SDK versions that might bring
  breaking changes (in which case breaking changes will be implemented under a higher version number)
- `sandbox`: (boolean, optional) - this enables you to configure the SDK to run in the sandbox.

## Using the SDK in sandbox mode:

```html
<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script>
  Pi.init({ version: "2.0", sandbox: true });
</script>
```

You may now run your app in the sandbox environment (https://sandbox.minepi.com), provided you've configured
a development URL in the developer portal. Visit the developer portal by opening develop.pi in the Pi Browser
to configure this and view your Sandbox URL.

> Typically, if you're using a framework or a boilerplate that supports it, you should be able to set up your
> sandbox flag to match your development environment. For example, most good Node boilerplates will set up the
> value of `process.env.NODE_ENV` to either `"development"` or `"production"`, and you could do something like:
> `Pi.init({ version: "2.0", sandbox: <%= process.env.NODE_ENV !== 'production' %> })`. This depends on your
> setup, but running the Pi SDK in sandbox mode will generally happen whenever your app is running in development.
