
# patchless

patchless is a _standard_ for modular ui apps.
It's primarily intended for secure scuttlebutt,
but not actually directly coupled to ssb.

## installation

clone this repo, npm install, and then run `electro index.js`
(you won't see much ;) then edit index.js, comment out different
modules and see that it still works.

## goals

This repo will not become a fully fledged, shiny, ssb app.
It will be a rough developer toolkit. I aim for this to be the
easiest way to create a customized patchapp, or insert a new
feature into any application derived from patchless!

There will be very little code in this repo, mainly it will become
documentation for patchless interfaces.

## TODO

* write up interfaces as precisely as possible.
* design compose interface?
* message extras interfaces?
* support multiple identities early,
  to make sure they get in on the ground floor.

## Interfaces

### layout

```
layout: {
  gives: {
    screen (): returns root layout html element,
      supporting hypertabs focus|blur events on change,
      and hyperloadmore hasmore|readymore events on scroll.
    goto (path): move the view to another app
  },
  needs: {
    app: {
      view (path): from app, loads a feed or document view
      menu (): from app, returns path that view(path) will render a view.
        the layout should present this to the user in some way so that they can navigate to it.
  }
}

```

layout manages navigation between screens.
one layout system might use forward/back navigation
another layout system could be tabs.
it should be fully possible to switch between different layouts.
The role of the layout module is quite similar to a window manager.

The layout needs a list of top level views (feeds) which can be navigated to
or displayed by default. to navigate to a document view, follow a link from a top level feed.

The layout also manages navigation to links. There are two ways that links are handled,
either there is a `<a href=...>` which is clicked (here the layout catches the click when it
bubbles up to window.onclick) or a click handler on an element calls goto(href, opts)
(opts can be provided to open externally, as a new tab, or as the layouts default mode,
and wether to focus to the opened element)

A layout is also responsible for managing scrolling.
currently, patchless uses `hyperloadmore` for scrolling.
This gives the choice of either infinite scrolling, or
"load more" buttons. Also, this moves the complicated part
into the layout, and apps just need to handle 'hasmore'
and 'readymore' events, this makes it easy to switch layouts
with the same apps.

gives: layout.screen, layout.goto
needs: app.view (first), app.menu (map)

### app

```
app: {
  gives: {
    view (path): returns html element.
      if this view is a feed/index it should interact with hasmore|readymore events.
    menu (): returns the paths this app needs statically.
  }
}
```

A view is a part of an application that is open at one time.

The view takes a string which is the identify for this view,
and returns an html element (which may dynamically update)

A string is used so that it's easy to keep a map of the currently open views,
and also so that a link to a view can be represented as a href.
If to express an location as an object, it can be encoded as a query string.

there are 3 ways I can think of that a view might be used.

#### app.view: feed

A feed is a view which is a continious list of objects,
for example new messages, private messages, search results,
open events, user feed. It might be the result of a user action
or it might be built into the app (say, just a single view like /public)

A feed is likely to have an infinite scroll bar.

A feed that does not need arguments should also give a menuItem so that
the layout can provide navigation to the view.

#### app.view: document / thread

A thread is the simplest example of a document view. This
shows messages related to a single message. for example,
a message thread. The messages that make up the document
are interpreted as a "single object". A thread renders
this as just a list of messages, and a gathering renders this
as updates to the same object but it's similar from a data design
perspective.

A `document` usually does not have an infinite scroll bar.
a document also does not give a menuItem, instead the user navigates to it via
the feed.

gives: view (id) => element

#### app.view: state

The third sort of screen is just about local application state
that is not represented as messages or feeds. for example, local
peers, gossip state, etc.

### components

Then there are other miscelanious components that make up an application.

These must have a well documented api.
so that each api can be switched to different implementations.

### avatar

gives:
  avatar.image (id) => img_element
  avatar.name (id) => string

### others?

compose and confirm? identity (for switch identies?)

### License

MIT

