com.caffeinalab.titanium.passcode
====================================

Alloy Titanium widget for an **identical** iPhone lock screen with passcode.

![image](http://cl.ly/image/1z1M0K1K3d0B/out.png)

## Installation

#### Via Gittio (Stable)

```
gittio install com.caffeinalab.titanium.passcode
```

#### Via Github (Master version, unstable)

```
git clone git@github.com:CaffeinaLab/com.caffeinalab.titanium.passcode.git app/widgets/com.caffeinalab.titanium.passcode
```

And add in your *config.json*, under `dependencies`:

```
"dependencies": {
    "com.caffeinalab.titanium.passcode": "*"
}
```

#### Usage

In your Alloy view:

```xml
<Widget id="PassCodeWidget" src="com.caffeinalab.titanium.passcode" code="42424" />
```

In your controller:

```javascript

// Set the success callback
PassCodeWidget.onSuccess(function() {
	alert("Yeah!")
});

PassCodeWidget.onError(function(times) {
	if (times>4) {
		alert("Shame on you!");
	}
});
```