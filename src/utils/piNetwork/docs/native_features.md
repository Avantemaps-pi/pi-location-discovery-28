
# Native Features

## Native features list

Use this method to get a list of native features available for specific version of Pi Browser your user is using. Some SDK features may require particular features to work properly.

```typescript
type NativeFeature = "inline_media" | "request_permission" | "ad_network";

Pi.nativeFeaturesList(): Promise<Array<NativeFeature>>;
```

## Share dialog

Open a native share dialog:

```typescript
Pi.openShareDialog(title: string, message: string): void;
```

Use this method to open a native Share dialog (provided by the phone's OS), enabling your users to share
content from your app with their friends.

- `title`: the title of the message being shared
- `message`: the message that will be sent when the user picks a target app in the Share flow
