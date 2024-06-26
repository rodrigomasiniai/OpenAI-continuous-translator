import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import UsersTable from '../../components/UsersTable';

const User = () => (
  <>
    <Segment>
      <Header as='h3'>Manage Users</Header>
      <UsersTable/>
    </Segment>
  </>
);

export default User;