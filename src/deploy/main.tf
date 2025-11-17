terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}


resource "azurerm_resource_group" "main" {
  name     = "${var.prefix}-rg"
  location = var.location
}

resource "azurerm_storage_account" "function_storage" {
  name                     = "${var.prefix}funcsa"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "main" {
  name                = "${var.prefix}-asp"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "Y1"  # Consumption plan
}

resource "azurerm_linux_function_app" "main" {
  name                = "${var.prefix}-func"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  storage_account_name       = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key
  service_plan_id            = azurerm_service_plan.main.id

  site_config {
    application_stack {
      node_version = "20"
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "node"
    "WEBSITE_RUN_FROM_PACKAGE"       = "1"

    "COSMOS_ENDPOINT"                = azurerm_cosmosdb_account.main.endpoint

    "ServiceBusConnection__fullyQualifiedNamespace" = "${azurerm_servicebus_namespace.main.name}.servicebus.windows.net"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_servicebus_subscription" "events" {
  name               = "pollymapper-events"
  topic_id           = azurerm_servicebus_topic.create_event.id
  max_delivery_count = 10
}

resource "azurerm_cosmosdb_sql_role_assignment" "function_cosmos" {
  resource_group_name = azurerm_cosmosdb_account.main.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
  role_definition_id  = "${azurerm_cosmosdb_account.main.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_linux_function_app.main.identity[0].principal_id
  scope               = azurerm_cosmosdb_account.main.id
}

resource "azurerm_role_assignment" "function_servicebus_receiver" {
  scope                = azurerm_servicebus_namespace.main.id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = azurerm_linux_function_app.main.identity[0].principal_id
}

output "function_app_name" {
  value = azurerm_linux_function_app.main.name
}

output "function_app_url" {
  value = azurerm_linux_function_app.main.default_hostname
}

output "function_principal_id" {
  value       = azurerm_linux_function_app.main.identity[0].principal_id
  description = "Managed Identity Principal ID for the Function App"
}
