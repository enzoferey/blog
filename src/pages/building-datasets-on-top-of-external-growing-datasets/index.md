---
title: 'Building datasets on top of external growing datasets'
date: '2019-12-02'
spoiler: Get datasets updates for free in a matter of seconds.
---

In a market where data is an asset, it's pretty common to consume external datasets. It could be via an API, parsing a CSV or even querying some SQL files.

Imagine you are starting a new project today. There are high chances that you need some kind of data to provide value. As your goal is to check if the product works at all, you would start searching for open datasets that contain the data you need rather than trying to build your own.

Then, two cases may happen:

1. You find a dataset that satisfies your requirements.
2. You don't find a dataset that satisfies your requirements.

If you are part of the unlikely second scenario, you will have no other option but to build your own dataset. As we are in 2019 and there are datasets about everything nowadays, let's focus on the first case from now on.

You found exactly the data you needed. You import it into your application, you ship a MVP, you measure, you iterate, and finally you get a working product.

The question that is hard to answer is: what should you do about the dataset ?

Let's explore a couple of scenarios based on your possible data needs:

- **You don't need more data, nor you think you will**. Best case scenario. Relax and celebrate.
- **You don't need more data right now, but you might in the future**. Nothing to do for now as it would be a bet to spend more resources. You might want to check from time to time related datasets to be aware of the latest additions and think if they could bring value to your product.
- **You do need more data right now, but the dataset doesn't contain it**. This is the worst scenario. It probably means you are diving into a field that has not been explored a lot yet. The data needs to appear somehow. If you manage to pull it off chances are that your product becomes big.
- **You do need more data right now, and the dataset contains it**. Grab the data. Relax and celebrate.

Of course, I might be a bit generic here. Each business case and dataset have a set of best decisions, and you are probably somewhere in between 2 of these positions rather than exactly at one of them. You can DM me on [Twitter](https://twitter.com/enzo_ferey) if you would like to talk about your case.

Now that you have the context. I would like to focus on a business decision that is common to take in early phases of a product: **build your own dataset on top of external growing datasets**.

---

### Why

Let's define the words "external" and "growing" in this context.

**External**: the dataset is not part of your organization and you don't have any decision power about how it should evolve over time.

In an ideal world, you would try to convert an external dataset into an internal one. You can achieve that by creating a partnership with the other organization or by becoming an external contributor. In practice, this is really hard. The vision of the maintainers might not totally fit with your business' vision. They might require high quality standards that you cannot afford just yet. They might not be able to merge your contributions in the timeframes your business needs them. There could be a lot of reasons why it cannot work.

**Growing**: the dataset is expected to grow over time.

The nuance in this case is how much and how fast it will grow. When talking about an external asset, you never have 100% confidence about what will happen. You need to evaluate if the growth you foresee is worth the resource investment. This is, again, a case by case discussion I would be happy to have with you.

In any case, the goal of building your dataset on top of an external growing dataset is to **get future data updates with minimum amount of effort**. It's free money.

From my experience, you most likely want to take this decision when you don't plan to spend a lot of resources on the dataset. If you are still uncertain in which direction you want to move it towards or if it's not a main asset for your product, you probably want to build a pipeline that will reuse external efforts. 

### How

Importing data once is generally straightforward, doing it on a regular basis and merging other data on top becomes a bit more tricky. It requires a good workflow around it.

After implementing several pipelines of this kind, I have iterated towards a process that seems to work out of the box for 95% of the cases:

```
Parse => (Validate) => Merge => Validate => Integrate => Automatize
```

We will be using the pipeline I built for [react-emoji-render](https://github.com/tommoor/react-emoji-render) as a real world example to make this explanation a bit more practical.

This library uses aliases to render emojis in a [React](https://reactjs.org/) environment. You can render them via unicode or using emoji's sets like [Twemoji](https://twemoji.twitter.com/) and [EmojiOne](https://www.joypixels.com/).

Our data needs are the following:

- We need to have all existing emojis at every time.
- We need to be able to reference them using different aliases.

The set of existing emojis is a good example of an external growing dataset. [Unicode.org](https://home.unicode.org/emoji/about-emoji/) is in charge of making the specification evolve over time, and even though you can contribute to it at some extend, it's not part of our business requirements. The datasets are available [here](https://unicode.org/Public/emoji/).

The aliases is a bit more fuzzy topic. They have been created by the community over time and there is no centralized dataset with all of them. This is yet another good example of an external growing dataset. It's even distributed along thousands of apps and libraries. After some research, I took the decision to use emoji's official name as starting base alias and add on top of that any other dataset of aliases I can find out there + the aliases the users of the library ask to have.

Let's see how we can build it:

#### 1. Parse

First, you need to parse the different sources of data to a format that will allow you to manipulate and merge them. As I work mainly with JavaScript, I normally parse all data sources to JSON, but it's up to you to define which format suits you the best.

For the emojis, luckily there are several open source projects out there that already do the heavy lifting for us. The best one I found was [unicode-emoji-json](https://github.com/muan/unicode-emoji-json). We will be using their [data-by-emoji.json](https://github.com/muan/unicode-emoji-json/blob/master/data-by-emoji.json) file, which contains the official `name` of each emoji that we will use as our base alias.

```jsx
// Input
{
  "😀": {
    "name": "grinning_face",
    "group": "Smileys & Emotion",
    "emoji_version": "2.0",
    "unicode_version": "6.1",
    "skin_tone_support": false
  },
  "😃": {
    "name": "grinning_face_with_big_eyes",
    "group": "Smileys & Emotion",
    "emoji_version": "2.0",
    "unicode_version": "6.0",
    "skin_tone_support": false
  },
  ...
}

// => 

// Output
{
  "😀": ["grinning_face"],
  "😃": ["grinning_face_with_big_eyes"],
  ...
}
```

For the aliases, I have found that [gemoji](https://github.com/github/gemoji/blob/master/db/emoji.json) has a pretty nice set of aliases.

```jsx
// Input
[
  {
    "emoji": "😀",
    "description": "grinning face",
    "category": "Smileys & Emotion",
    "aliases": ["grinning"],
    "tags": ["smile", "happy"],
    "unicode_version": "6.1",
    "ios_version": "6.0"
  },
  {
    "emoji": "😃",
    "description": "grinning face with big eyes",
    "category": "Smileys & Emotion",
    "aliases": ["smiley"],
    "tags": ["happy", "joy", "haha"],
    "unicode_version": "6.0",
    "ios_version": "6.0"
  },
  ...
]

// =>

// Output
{
  "😀": ["grinning"],
  "😃": ["smiley"],
  ...
}
```

#### 2. Validate

Then, you should consider about validating the parsed files. This step will bring you confidence about the parsed data having the shape you are expecting. It's particularly important when you are parsing datasets of poor quality that may not have a clearly defined schema. In practice, I sometimes skip this step when it won't bring me much value. The validation step that truly matters is the one done after merging the different data sources.

Again in the JavaScript ecosystem, I generally use [`@hapi/joi`](https://github.com/hapijs/joi) for validating the data schemas.

For our emojis library, we could validate that the parsed files are valid JSON files that contain an object of string keys and array of strings values.

#### 3. Merge

Once you have reliable parsed data, it's time to figure out how you want to merge it to build the final dataset. This step is particularly important, so I recommend to build it in the most modular possible way. This will allow you in the future to easily swap around which data takes preference over which one. It may be very useful if you want to test different algorithms or if suddenly one dataset grows very fast and you want to use it as the new baseline.

As described in the data needs of the emoji library, we will use official aliases (from Unicode.org specification) + gemoji aliases (from `gemoji` library) + custom aliases (from our library).

The merge algorithm in this case is straightforward: for each dataset, loop on the entries and add every alias of each emoji.

```jsx
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const baseAliases = require("../../data/aliases/baseAliases.json");
const gemojiAliases = require("../../data/aliases/gemojiAliases.json");
const customAliases = require("../../data/aliases/customAliases.json");

const OUTPUT_FILE_PATH = path.resolve("data", "aliases.js");

const mergedAliases = {};

function addAliases(aliases) {
  Object.entries(aliases).forEach(([emoji, aliases]) => {
    aliases.forEach(alias => {
      mergedAliases[alias] = emoji;
    });
  });
}

addAliases(baseAliases);
addAliases(gemojiAliases);
addAliases(customAliases);

const preGlue = "module.exports = ";
const postGlue = ";\n";

const content = `${preGlue}${JSON.stringify(mergedAliases)}${postGlue}`;
const formattedContent = prettier.format(content, { parser: "babel" });

fs.writeFile(OUTPUT_FILE_PATH, formattedContent, error => {
  if (error) {
    return console.log(error);
  }

  console.log("`aliases.js` file generated =>", OUTPUT_FILE_PATH);
});
```

This script generates a JavaScript file that looks like this:

```jsx
module.exports = {
  "grinning_face": "😀",
  "grinning_face_with_big_eyes": "😃",
  "grinning": "😀",
  "smiley": "😃",
  ...
}
```

The reason why we use aliases as keys rather than emojis is to check if an alias exists O(1) complexity.

#### 4. Validate

Next, you need to validate that our generated file matches your data needs. As described in step 2, this is particularly important in order to catch possible unexpected data values that may cause bugs in your product.

In the emojis case, we want string aliases that only contain certain characters as keys and string values that can't be `undefined` or `null` as values. This is how our validation script looks like:

```jsx
const Joi = require("@hapi/joi");

const aliases = require("../../data/aliases");

// Regex extracted from "../../src/aliasRegex.js"
const JoiSchema = Joi.object().pattern(
  /^[\w\-\_\+\*\(\)\!#&åô’çéãí“”,]+$/,
  Joi.string().required()
);

const { error } = JoiSchema.validate(aliases);
if (error === undefined) {
  console.log("=> ✅ Valid data");
} else {
  console.log("=> ❌ ", error.details[0]);
}
```

We could go one step further and try to validate if the values are strings that contain an emoji, but it's quite difficult to get it right and not worth the confidence at the moment.

#### 5. Integrate

As the next step, you would need to integrate your shinny dataset into your product. This could mean importing it into a database, uploading it to a CDN, adding it as a local file to your server and serving it via an API. The possibilities are endless and depend on your product.

In our case, we don't have anything else to do. The library can already consume the generated JavaScript file.

#### 6. Automatize

Finally, you need to make sure that this whole process can be rerun later in time with the less possible amount of effort. The degree of automatization you want to reach is based on how often you think you will need to run the pipeline and how expensive it is to setup.

For our case, it's expected to have official emojis update every year approximately and aliases could grow very fast. As all the script are using [Node.js](https://nodejs.org/en/), it's quite cheap to orchestrate them via package scripts and get to a point where we just need to update the raw data sources and execute a single script to trigger the whole pipeline.

If you are curious how it can be done, it's [open source](https://github.com/tommoor/react-emoji-render).

---

### Closing words

Building datasets in this way can bring you huge benefits. It's no longer only about getting future updates for free, but also about having a clear overview of the different layers required to build your dataset. This makes it easier for newcomers to understand and contribute to it.

The good news is that it's generally pretty cheap to setup and it's not a lock-in decision. You can benefit from external updates for a while and then use the current dataset as the starting point for your organization to start investing resources into it.