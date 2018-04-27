import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import Block from '../app/src/components/Block';
import Grid from '../app/src/components/Grid';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf('Block', module)
    .add('Text', () => <Block data={{blockType: 'Text'}} initDraggable={()=>{return {unsubscribe(){}}}}/>)
    .add('Regular', () => <Block data={{blockType: 'Regular'}} initDraggable={()=>{return {unsubscribe(){}}}}/>);

storiesOf('Grid', module)
    .add('empty', () => <Grid data={{blockType: 'Grid'}} initGrid={()=>{}}/>);

