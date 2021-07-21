import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 4,
  },
  media: {
    height: 140,
  },
});

export default function ProductList({ data }) {
  const classes = useStyles();

  return (
    <GridContainer>
      {data.map((product, index) => (
        <GridItem xs={12} sm={3} md={3} key={product.id}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={product.images[0]}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {product.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Link href={`/admin/product/${product.id}`}>
                <a>Edit</a>
              </Link>
            </CardActions>
          </Card>
        </GridItem>
      ))}
    </GridContainer>
  );
}
