import { Route, Routes } from '@solidjs/router';
import { AssetDetail } from './asset-detail';
import { Assets } from './assets';
import { Control } from './control';
import { EventDetail } from './event-detail';
import { Events } from './events';
import { Index } from './index';
import { NotFound } from './not-found';
import { Present } from './present';
import { Users } from './users';

export const AppRoutes = () => (
  <Routes>
    <Route path="/events" component={Events} />
    <Route path="/events/:id" component={EventDetail} />
    <Route path="/events/:id/control" component={Control} />
    <Route path="/events/:id/present" component={Present} />
    <Route path="/assets/" component={Assets} />
    <Route path="/assets/:id" component={AssetDetail} />
    <Route path="/users/" component={Users} />
    <Route path="/" component={Index} />
    <Route path="/*any" component={NotFound}></Route>
  </Routes>
);
