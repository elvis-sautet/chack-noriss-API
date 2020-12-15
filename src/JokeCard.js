import React from "react";
import { CardContent, CardActions, Card, Button } from "@material-ui/core";
import { Typography, Chip, withStyles, makeStyles } from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

const useStyles = makeStyles({
  card: {
    marginBottom: 20,
  },
  CardContent: {
    paddingBottom: 5,
  },
  CardActions: {
    padding: 16,
  },
});

const Category = withStyles({
  root: {
    marginTop: 10,
    marginBottom: 10,
  },
})(Chip);

function JokeCard({ joke, likedJoke, unlikedJoke, index }) {
  const classes = useStyles();
  return (
    <Card className={classes.card} id={`joke-${index}`}>
      <CardContent className={classes.CardContent}>
        {joke.categories.length > 0 ? (
          joke.categories.map((cat) => (
            <Category key={cat} label={cat} variant="outlined" />
          ))
        ) : (
          <Category label="no-category" color="secondary" variant="outlined" />
        )}

        <Typography dangerouslySetInnerHTML={{ __html: joke.joke }} />
      </CardContent>
      <CardActions className={classes.CardActions}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => likedJoke(joke.id)}
        >
          <ThumbUpAltIcon />
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={() => unlikedJoke(joke.id)}
        >
          <ThumbDownIcon />
        </Button>
      </CardActions>
    </Card>
  );
}

export default JokeCard;
