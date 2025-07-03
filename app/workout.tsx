import { Link } from "expo-router";
import { COLORS } from "./costants";
import { StyleSheet, View, Text, Pressable } from 'react-native'

export default function WorkoutScreen() {

    return (
        <View style={ styles.container }>
            
          <BackButton />

        </View>
    );
}

export function BackButton() {
  return (
    <Link href='/(tabs)' style={ styles.button }> Back </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK_GRAY,
    alignContent: 'center',
    justifyContent: 'center',
  },
  boxView: {
    backgroundColor: COLORS.BACKGROUND_BLUE,
    borderRadius: 25,
    borderColor: COLORS.TEAL,
    borderWidth: 3,
    padding: 2,
    marginHorizontal: 30,
    paddingTop: 15,
  },
  logout: {
    margin: 20,
    position: 'absolute',
    top: 20,
    right: 0,
    backgroundColor: COLORS.TEAL, 
    marginTop: 30,
    width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    backgroundColor: COLORS.CYAN,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.TEAL,
    position: 'absolute',
    top: 50,
    left: 20
  },
  titleView: {
    flex: 0,
    backgroundColor: COLORS.GRAY,
    width: '100%',
    height: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    marginVertical: 10, 
    alignSelf: 'center',
  },
  scrollableView: {
    paddingBottom: 50,
    rowGap: 40,
  },

});