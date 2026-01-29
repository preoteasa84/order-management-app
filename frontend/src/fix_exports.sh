#!/bin/bash

# For OrdersAgentScreen
{
  echo "export const OrdersAgentScreen = ({"
  echo "  dayStatus, setDayStatus, clients, products, agents, orders, setOrders,"
  echo "  showMessage, createOrder, updateOrder, deleteOrder, API_URL, token"
  echo "}) => {"
  sed -n '2,$p' ~/projects/frontend/src/pages/OrdersAgentScreen.jsx | head -n -1
  echo "};"
} > ~/projects/frontend/src/pages/OrdersAgentScreen.jsx.new && mv ~/projects/frontend/src/pages/OrdersAgentScreen.jsx.new ~/projects/frontend/src/pages/OrdersAgentScreen.jsx

echo "Fixed OrdersAgentScreen"
