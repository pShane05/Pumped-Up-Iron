import { Tabs } from "expo-router"
import { COLORS } from "../costants"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveBackgroundColor: '#E113C5',
            tabBarActiveTintColor: '#10002B',
            tabBarInactiveBackgroundColor: COLORS.PURPLE,
            headerStyle: {
                backgroundColor: '#10002B'
            },
            headerTintColor: '#E113C5',
            tabBarStyle: {
                backgroundColor: '#10002B'
            }
             }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Train',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="dumbbell" color={ color } size={ size } />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="shop"
                    options={{
                        title: "Shop",
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="basket-shopping" color={ color } size={ size } />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="base"
                    options={{
                        title: "Base",
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="house-chimney" color={ color } size={ size } />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="avatar"
                    options={{
                        title: "Avatar",
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="person-half-dress" color={ color } size={ size } />
                        ),
                    }}
                />
        </Tabs>
    )
}