# Migration

`MigrationModule` extends Core with the `/migration` REST API.

This module is for an API for converting SiteWise Monitor dashboards to IoT Application dashboards.

# Dashboard definition conversion

This service takes customer's SiteWise Monitor dashboard definitions and converts them to IoT Application dashboard definitions. There are some important differences between the two dashboard definitions that can make this conversion complicated.

### Feature differences
* SiteWise Monitor supports an alarms feature, while IoT Application currently does not
* KPI and Status Grid in SiteWise Monitor support multiple datastreams per widget, in IoT Application we support one datastream per widget
* There is a different layout system in each application
* Colors are different between applications

### KPI and Status Grid Differences
The logic to convert KPI and Status Grid widgets from SiteWise Monitor to IoT Application is complicated because there is a one-to-many relationship from SiteWise Monitor to IoT Application widgets and feature differences. 

In Monitor, as datastreams are added to a KPI/Grid widget, Monitor automatically resizes these sub-widgets to fit within the bounds of the containing widget. If the screen space is filled, a scrollbar is added and customers can scroll to view all their datastreams within the single KPI/Grid widget. These features do not exist in this IoT Application, so the service attempts to convert the definitions in a way that maintain these properties and match closely visually.

The conversion process follows this logic:
* When there are few (relative to the total size of the containing KPI/Grid widget) sub-widgets, scale them to fit within the size of the containg widget. For example if the Monitor KPI widget is a 9x9 grid, and there is 1 sub-widget, make this sub-widgets size 9x9. If there is 2 sub-widgets, divide this in half, etc. up until the minimim size values.
* When there are many sub-widgets, use the minimum size value and lay them out in rows/columns within the bounds of the containing widget. Because we don't support a scrolling widget, if the Monitor widget has so many sub-widgets that there is a scrollbar, the IoT Applications will overflow and may overlap with other widgets.

# Single-threaded execution

This service relies on NestJS's usage of singleton service instances and uses local class variables for storing status. If we wish to run this application in a multi-threaded or multi-container environment we would need to update how it stores status to consider parallel execution.
