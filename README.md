# GoOnDate-Tailwind

1. To install dependencies run `yarn`
1. To run development server run `yarn dev`
1. To run build project run `yarn build` // you will find build files in dist folder
1. To run production server run `yarn preview`

# How to Link wardates to `index.html`

```jsx
import { Link } from "wouter";

<Link href="/foo" className="active">
  Go To WarDates
</Link>;

// OR

<Link href="/foo">
  <a className="active">Go To WarDates</a>
</Link>;
```
