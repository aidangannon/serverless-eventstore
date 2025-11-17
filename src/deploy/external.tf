resource "azurerm_servicebus_namespace" "main" {
  name                = "${var.prefix}-sb-ns"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Standard"
}

resource "azurerm_servicebus_topic" "create_event" {
  name         = "PolyMapper.CreateEvent"
  namespace_id = azurerm_servicebus_namespace.main.id
}


resource "azurerm_cosmosdb_account" "main" {
  name                = "${var.prefix}-cosmos"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "events_service" {
  name                = "EventsService"
  resource_group_name = azurerm_cosmosdb_account.main.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
}

resource "azurerm_cosmosdb_sql_container" "events_service" {
  name                = "EventsService"
  resource_group_name = azurerm_cosmosdb_account.main.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.events_service.name
  partition_key_paths = ["/id"]  # Adjust based on your partition strategy
}

output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.main.endpoint
}

output "cosmos_account_name" {
  value = azurerm_cosmosdb_account.main.name
}

output "servicebus_namespace" {
  value = azurerm_servicebus_namespace.main.name
}

output "servicebus_namespace_fqdn" {
  value = "${azurerm_servicebus_namespace.main.name}.servicebus.windows.net"
}

output "topic_name" {
  value = azurerm_servicebus_topic.create_event.name
}

output "subscription_name" {
  value = azurerm_servicebus_subscription.events.name
}
