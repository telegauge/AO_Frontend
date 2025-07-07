# Actuator Orchestra Frontend

The Actuator Orchestra Frontend provides a web-based interface for controlling and orchestrating physical musical instruments. It needs to talk to an AO-enabled instrument.

See the [Actuator Orchestra](https://github.com/telegauge/ActuatorOrchestra) repository for more information.

## Tech Stack

- Vue.js for reactive UI components
- Quasar Framework for UI/UX
- SCSS for styling
- PUG for template syntax
- NPM for package management

## Setup Requirements

- AO-enabled instrument
- Node.js (Latest LTS recommended)
- NPM
- Git

## Installation

- Clone the repository: `git clone https://github.com/telegauge/AO_Frontend.git`
- Navigate to project: `cd AO_Frontend`
- Install dependencies: `npm install`
- Start development server: `npm run dev`

## Project Structure

- `/src/components/` - Reusable Vue components
  - `/Guitar/` - Guitar-specific components and views
- `/src/pages/` - Application routes and views
  - `/Instrument/` - Instrument management pages
- `/src/stores/` - State management
- `/src/layouts/` - Page layouts and templates
- `/src/css/` - Global styles and Quasar variables
- `/src/router/` - Route configurations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run code linting

## Features

- Real-time instrument control
- Instrument management (Add/Edit/View)
- Guitar-specific interface
- Responsive design for various screen sizes

## Connect

![Bluesky](https://img.shields.io/badge/-Bluesky-3686f7?style=flat&logo=icloud&logoColor=white)
[@acutatororchestra.bsky.social](https://bsky.app/profile/acutatororchestra.bsky.social)
