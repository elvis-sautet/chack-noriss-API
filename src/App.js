import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Container,
  Typography,
  CircularProgress,
  AppBar,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
  Badge,
} from "@material-ui/core";

import JokeCard from "./JokeCard";

function App() {
  const [jokes, setJokes] = useState([]);
  const [jokesToShow, setJokesToShow] = useState([]);
  const [categories, SetCategories] = useState([]);

  const [likedJokes, setLikedJokes] = useState([]);
  const [loading, SetLoading] = useState(false);
  const [indexTab, setCurrentTab] = useState(0);
  const [filterCategories, setFilterCategories] = useState([]);
  const CHUNK_URL = "https://api.icndb.com/jokes";

  useEffect(() => {
    fetch(CHUNK_URL)
      .then((res) => res.json())
      .then((data) => {
        setJokes(data.value);
        setJokesToShow(data.value.slice(0, 10));
        observeElement();
      })
      .catch((err) => console.log(err));
    fetch("https://api.icndb.com/categories")
      .then((res) => res.json())
      .then((data) => {
        SetCategories(data.value);
        setFilterCategories(data.value);
      })
      .catch((err) => console.log(err));
  }, []);

  //localHost localStorage
  const CHACK_NORIS_KEY = "chackNoris.api";

  //load the liked ones from local storage persistence
  useEffect(() => {
    const storedLiked = JSON.parse(localStorage.getItem(CHACK_NORIS_KEY));
    if (storedLiked) setLikedJokes(storedLiked);
  }, []);

  //saving the liked joke to localstorage
  useEffect(() => {
    localStorage.setItem(CHACK_NORIS_KEY, JSON.stringify(likedJokes));
  }, [likedJokes]);

  //liking the joke
  const likedJoke = (id) => {
    if (likedJokes.find((j) => j.id === id)) return;
    const likedJoke = jokes.find((j) => j.id === id);
    setLikedJokes([likedJoke, ...likedJokes]);
    console.log("joke liked");
  };

  //unliking the joke
  const unlikedJoke = (id) => {
    console.log("unliking joke", id);
    const newLikedJokes = likedJokes.filter((joke) => joke.id !== id);
    setLikedJokes(newLikedJokes);
  };
  const changeTab = (event, value) => {
    setCurrentTab(value);
  };

  //ading more jokes while at bottom
  const pushMoreJokes = () => {
    SetLoading(true);
    setTimeout(() => {
      setJokesToShow(jokes.slice(0, jokesToShow.length * 3));
    }, 700);
  };
  //observe the element when  we reach at the bottom of the page.
  const observeElement = (bottomJoke) => {
    if (!bottomJoke) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("Adding more jokes ");
          //adding more jokes
          pushMoreJokes();
          observer.unobserve(bottomJoke);
        }
      },
      {
        threshold: 1,
      }
    );
    const bottomEl = jokesToShow.length - 1;
    const bottomJokeId = `joke-${bottomEl}`;
    const bottomJokeEL = document.getElementById(bottomJokeId);
    observer.observe(bottomJokeEL);
  };

  useEffect(() => {
    const bottomJokeEl = document.getElementById(
      `joke-${jokesToShow.length - 1}`
    );
    observeElement(bottomJokeEl);
  }, [jokesToShow]);

  const changeCategory = (event) => {
    const category = event.target.name;
    if (filterCategories.includes(category)) {
      //if found remove
      const fileterCategoryCopy = [...filterCategories];
      const categoryIndex = fileterCategoryCopy.indexOf(category);
      fileterCategoryCopy.splice(categoryIndex, 1);
      setFilterCategories(fileterCategoryCopy);
    } else {
      //else add it
      setFilterCategories([...filterCategories, category]);
    }
  };

  const categoryMatch = (jokeCategories) => {
    for (let i = 0; i < jokeCategories.length; i++) {
      if (filterCategories.includes(jokeCategories[i])) return true;
    }
    return false;
  };
  return (
    <div className="App">
      <CssBaseline />
      <Container>
        <Typography variant="h3" align="center" style={{ margin: "1rem" }}>
          Chunck Norris Jokes API
        </Typography>
        <AppBar styles={{ marginBottom: 29 }} position="sticky">
          <Tabs centered value={indexTab} onChange={changeTab}>
            <Tab label="Home" id="home-tab" aria-controls="home-pannel" />
            <Tab
              label={
                <Badge
                  badgeContent={4}
                  color="secondary"
                  badgeContent={
                    likedJokes.length > 0 ? likedJokes.length : null
                  }
                >
                  Likes{" "}
                </Badge>
              }
              id="like-tab"
              aria-controls="like-pannel"
            />
          </Tabs>
        </AppBar>

        <div role="tabpanel" hidden={indexTab !== 0}>
          {/* category filters */}
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              label={category}
              control={
                <Checkbox
                  name={category}
                  color="primary"
                  checked={filterCategories.includes(category)}
                  onChange={changeCategory}
                />
              }
            />
          ))}
          {/* joke cards */}
          {jokesToShow.map((joke, index) => {
            if (
              joke.categories.length === 0 ||
              categoryMatch(joke.categories)
            ) {
              return (
                <JokeCard
                  index={index}
                  key={joke.id}
                  joke={joke}
                  likedJoke={likedJoke}
                  unlikedJoke={unlikedJoke}
                />
              );
            }
          })}
          {loading && (
            <div style={{ textAlign: "center" }}>
              {" "}
              <CircularProgress className="MuiCircularProgress-circleStatic" />
            </div>
          )}
        </div>
        <div role="tabpanel" hidden={indexTab !== 1}>
          {/* it maps from the liked jokes and the content stays there even after refresh because its from local storage */}
          {likedJokes.map((joke, index) => (
            <JokeCard
              key={joke.id}
              joke={joke}
              likedJoke={likedJoke}
              unlikedJoke={unlikedJoke}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
