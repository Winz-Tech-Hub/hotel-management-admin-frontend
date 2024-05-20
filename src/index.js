import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/vendor/fonts/boxicons.css'
import './assets/css/scansio-style.css'
import './assets/css/util.css'
import './assets/css/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// import "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.scss";
import './assets/vendor/js/helpers.js'
import './assets/js/config.js'
import './assets/vendor/libs/jquery/jquery.js'
// import "react-quill/dist/quill.snow.css";
// import './scripts/lib/scansio-script.js'
import './assets/vendor/libs/popper/popper.js'
// import "../node_modules/perfect-scrollbar/dist/perfect-scrollbar.js";
import './assets/vendor/js/menu.js'
import './assets/js/main.js'
import './assets/css/custom-style.scss'

import './assets/vendor/css/core.css'
import './assets/vendor/css/theme-default.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Routing from './scripts/Routing'

const root = ReactDOM.createRoot(document.getElementById('root'))
const routing = new Routing()
const inSecuredRoutes = routing.getInSecuredRoutes()
const securedRoutes = routing.getSecuredRoutes()
root.render(
  <BrowserRouter>
    <Routes>
      {inSecuredRoutes}
      {securedRoutes}
      <Route exact path="/" Component={(props) => <Navigate to="/home" {...props} />} />
      <Route exact path="/login" Component={(props) => <Navigate to="/home" {...props} />} />
      <Route path="*" Component={(props) => <NotFound {...props} />} />
    </Routes>
  </BrowserRouter>,
)
