import { COLORS } from "./costants";
import { StyleSheet, View, Text, Pressable } from 'react-native'

export default function WorkoutScreen() {
    <View style={ styles.container }>
        <Text style={{ fontSize: 20, color: COLORS.TEAL}}> Workout </Text>
    </View>

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
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.CYAN,
    borderColor: COLORS.TEAL,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.TEAL
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
  }
});