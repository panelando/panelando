import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'

import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardText,
  CardTitle,
  Chip,
  IconButton,
  Input,
  List,
  ListCheckbox,
  ListDivider,
  ListItem,
  ListSubHeader,
  Panel
} from 'react-toolbox'

import {
  DifficultyIcon,
  IngredientIcon,
  PortionIcon,
  StepIcon,
  TimeIcon
} from 'components/icons'

import styles from './styles'

class Show extends Component {
  state = {
    comment: ''
  }

  trim = (str, quantity = 30) => str.substring(0, quantity)

  handleCommentChange = comment => this.setState({ comment })

  render () {
      return (
        <Panel scrollY>
          <section>
            <AppBar>
              <IconButton icon="arrow_back" inverse={true} onClick={this.props.router.goBack} />
              <span>{this.trim("Whiskey Glazed Flat Iron Steaks and Grilled Potatoes")}</span>
            </AppBar>

            <Card>
              <CardMedia
                aspectRatio="wide"
                image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d8108430269011.561bad832d25f.jpg"
              />

              <CardTitle
                title="Whiskey Glazed Flat Iron Steaks and Grilled Potatoes"
              />

              <CardText className={styles.recipeInfo}>
                <div>
                  <IconButton><TimeIcon /></IconButton>
                  <span>60 min</span>
                </div>

                <div>
                  <IconButton><PortionIcon /></IconButton>
                  <span>3 porções</span>
                </div>

                <div>
                  <IconButton><DifficultyIcon /></IconButton>
                  <span>Muito Difícil</span>
                </div>
              </CardText>

              <CardTitle
                avatar="https://avatars2.githubusercontent.com/u/7416751?v=3&s=466"
                title="Guilherme Coelho"
                subtitle="Food artisan and disruptive entrepreneur"
                style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}
              />

            <CardActions
              style={{ borderBottom: '1px solid #f5f5f5' }}
            >
                <IconButton icon="favorite" onClick={this.favorite} />
                <span>42</span>
              </CardActions>

              <List selectable ripple>
                <ListSubHeader caption="Ingredientes" />

                <ListItem caption="200g de farinha de trigo">
                  <IconButton><IngredientIcon /></IconButton>
                </ListItem>

                <ListItem caption="2 xícaras de leite">
                  <IconButton><IngredientIcon /></IconButton>
                </ListItem>

                <ListItem caption="3 ovos">
                  <IconButton><IngredientIcon /></IconButton>
                </ListItem>

                <ListDivider />

                <ListSubHeader caption="Modo de Preparo" />

                <ListItem className={styles.step} caption="Bata os ovos até formar clara em neve">
                  <IconButton><StepIcon /></IconButton>
                </ListItem>

                <ListItem className={styles.step} caption="Misture no liquidificador o leite">
                  <IconButton><StepIcon /></IconButton>
                </ListItem>

                <ListItem className={styles.step} caption="Junte a farinha com tudo e misture bem">
                  <IconButton><StepIcon /></IconButton>
                </ListItem>

                <ListItem className={styles.step} caption="Leve ao forno 180ºC por 60 minutos asd asd asd asd asd asd asd ads ">
                  <IconButton><StepIcon /></IconButton>
                </ListItem>

                <ListDivider />

                <ListSubHeader caption="Tags" />

                <ListItem className={styles.tags}>
                  <Chip>vegan</Chip>
                  <Chip>glutenfree</Chip>
                  <Chip>comida árabe</Chip>
                  <Chip>sugarfree</Chip>
                  <Chip></Chip>
                  <Chip>comida árabe</Chip>
                </ListItem>

                <ListDivider />

                <ListSubHeader caption="Comentários" />

                <ListItem
                  className={styles.comment}
                  avatar="https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg"
                  caption="Dr. Manhattan"
                  legend="I like this recipe very much. I'm gonna use it on my Mars Birthday. But there's no such a thing as coconut oil on planets, unless of course your planet is called Earth in which yes, you can find it hanging on shelves."
                  rightIcon="reply"
                />

                <ListItem
                  className={styles.comment}
                  avatar="https://dl.dropboxusercontent.com/u/2247264/assets/o.jpg"
                  caption="Ozymandias"
                  legend="Can I use codorna eggs?"
                  rightIcon="reply"
                />

                <ListSubHeader caption="Adicionar Comentário" />

                <form className={styles.commentForm}>
                  <div className={styles.commentBox}>
                    <Avatar className={styles.commentAvatar}>
                      <img src="https://avatars2.githubusercontent.com/u/7416751?v=3&s=466" />
                    </Avatar>

                    <Input className={styles.commentInput} multiline label="Adicionar Comentário" value={this.state.comment} onChange={this.handleCommentChange} />
                  </div>

                  <Button type="submit" className={styles.commentButton} icon="send" label="Enviar" primary />
                </form>
              </List>
            </Card>
          </section>
        </Panel>
      )
  }
}

export default withRouter(Show)

