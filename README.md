# mobile-sidenav
mobile-nav

## Usage

Add js and css file to html

Mobile side nav is object oriented

```js
var sideNav = new MobileSideNav(options)
```

Options are :

* menus : list of jQuery object to be clone in the menu (your navigation)
* afterDraw : function to be execute after the menu has been drawned

Example

```js
var options = {
  menus : {
    mainNav : $('#foo ul.nav')
  },
  afterDraw : function($context)
  {
    initPage($context);
  }
}
```
