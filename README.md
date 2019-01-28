
# react-native-in-app-popup-notification

## Getting started

`$ npm install react-native-in-app-popup-notification --save`

### Mostly automatic installation

`$ react-native link react-native-in-app-popup-notification`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-in-app-popup-notification` and add `RNInAppPopupNotification.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNInAppPopupNotification.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNInAppPopupNotificationPackage;` to the imports at the top of the file
  - Add `new RNInAppPopupNotificationPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-in-app-popup-notification'
  	project(':react-native-in-app-popup-notification').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-in-app-popup-notification/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-in-app-popup-notification')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNInAppPopupNotification.sln` in `node_modules/react-native-in-app-popup-notification/windows/RNInAppPopupNotification.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using In.App.Popup.Notification.RNInAppPopupNotification;` to the usings at the top of the file
  - Add `new RNInAppPopupNotificationPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNInAppPopupNotification from 'react-native-in-app-popup-notification';

// TODO: What to do with the module?
RNInAppPopupNotification;
```
  