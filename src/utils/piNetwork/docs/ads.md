
# Ads

SDK contains the `Ads` module (object) which allows developers to display ads to the users. It provides several methods for both interstitial and rewarded ads. All of the methods take advantage of Promise-based asynchronicity.

```typescript
type AdType = "interstitial" | "rewarded";
```

## Show ad

Use `showAd(adType: "interstitial" | "rewarded")` method to display an ad to a user. It returns a promise which resolves with an object of type `ShowAdResponse`:

```typescript
type ShowAdResponse =
  | {
      type: "interstitial";
      result: "AD_CLOSED" | "AD_DISPLAY_ERROR" | "AD_NETWORK_ERROR" | "AD_NOT_AVAILABLE";
    }
  | {
      type: "rewarded";
      result: "AD_REWARDED" | "AD_CLOSED" | "AD_DISPLAY_ERROR" | "AD_NETWORK_ERROR" | "AD_NOT_AVAILABLE" | "ADS_NOT_SUPPORTED" | "USER_UNAUTHENTICATED";
      adId?: string;
    };

Pi.Ads.showAd(adType: AdType): Promise<ShowAdResponse>
```

- `"AD_NOT_AVAILABLE"` indicates the ad failed to load,
- `"AD_CLOSED"` indicates the ad was successfully displayed and closed,
- `"AD_REWARDED"` indicates the ad was successfully displayed and rewarded (only applicable for `rewarded` ads),
- `"AD_DISPLAY_ERROR"` indicates the ad was successfully loaded but failed to be displayed,
- `"AD_NETWORK_ERROR"` indicates that a user might have encountered network connection issues,
- `"ADS_NOT_SUPPORTED"` - indicates that app version used by uesr does not support ads,
- `"USER_UNAUTHENTICATED"` - indicates that user is not authenticated therefore rewarded ad cannot be display (only for `rewarded` ads).

The Pi Browser internally manages the ads availability strategy, automatically loading initial ads and reloading them whenever displayed. This ensures that ads are consistently ready for display. However, in rare cases, loading ads may be interrupted or the third party app may use `showAd()` methods too quickly (even before the next ad is ready). To allow developers handle these cases, the Pi SDK provides additional methods: `isAdReady()` and `requestAd()`.

</br>

> **Notes:**
>
> - If your application was approved to Pi Developer Ad Network, the response from `Pi.Ads.showAd('rewarded')` will contain additional `adId` fields, which allows you to [verify the rewarded status using Pi Platform API](ads.md#rewarded-ads-status-verification-with-pi-platform-api).
> - If your application wasn't approved to Pi Developer Ad Network, the `adId` field will be missing from `Pi.Ads.showAd('rewarded')` response. You should not grant rewards to users without verifying the `adId` using [Pi Platform API](platform_API.md#verify-a-rewarded-ad-status).

## Check if ad is ready

Use `isAdReady(adType: "interstitial" | "rewarded")` method to check if an ad of specific type is available. This method returns a promise which resolves with object of type `IsAdReadyResponse`.

```typescript
type IsAdReadyResponse = {
  type: "interstitial" | "rewarded";
  ready: boolean;
};

Pi.Ads.isAdReady(adType: AdType): Promise<IsAdReadyResponse>
```

The Pi Browser internally manages the ads availability strategy, automatically loading initial ads and reloading them whenever displayed. This ensures that ads are consistently ready for display. However, in rare cases, loading ads may be interrupted or the third party app may use `showAd()` methods too quickly (even before the next ad is ready). To address such cases, the Pi SDK provides this method to allow developers to check the availability of ads explicitly.

## Request ad

Use `requestAd(adType: "interstitial" | "rewarded")` method to request an interstitial or a rewarded ad. It returns a promise which resolves with an object of type `RequestAdResponse`:

```typescript
type RequestAdResponse = {
  type: "interstitial" | "rewarded";
  result: "AD_LOADED" | "AD_FAILED_TO_LOAD" | "AD_NOT_AVAILABLE";
};

Pi.Ads.requestAd(adType: AdType): Promise<RequestAdResponse>
```

As with the Ads availability strategy, the Pi Browser internally manages the process of requesting new ads to replace the displayed ones. While it's not guaranteed that an ad will be available at all time, developers can use `requestAd()` method to manually retry the ad request in case a promise returned by the `isAdReady()` resolved with `false`.
