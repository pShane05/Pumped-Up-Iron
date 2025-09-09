import { Dimensions, StyleSheet } from "react-native"


export const COLORS = {
    BLACK: '#000000',
    DARK_GRAY: '#202020',
    TEAL: '#cbeef3',
    
    CYAN: '#1579b5',
    PINK: '#E113C5',
    PURPLE: '#550577',
    DARK_PURPLE: '#350537',
    RED: '#ff0000',

    PRIMARY: '#10002b',
    SECONDARY: '#80FFDB',
    ALT: '#0D6B93',
    BORDER: '#64DFDF',
    BACKGROUND: '#151515',

    TRANSPURPLE: 'rgba(85, 5, 119, 0.25)'
}

export const imageMap: Record<string, any> = {
  'quads_icon.png': require('../assets/icons/quads_icon.png'),
  'calves_icon.png': require('../assets/icons/calves_icon.png'),
  'hamstrings_icon.png': require('../assets/icons/hamstrings_icon.png'),
  'ant_deltoids_icon.png': require('../assets/icons/ant_deltoids_icon.png'),
  'post_deltoids_icon.png': require('../assets/icons/post_deltoids_icon.png'),
  'traps_icon.png': require('../assets/icons/traps_icon.png'),
  'abs_icon.png': require('../assets/icons/abs_icon.png'),
  'upper_abs_icon.png': require('../assets/icons/upper_abs_icon.png'),
  'lower_abs_icon.png': require('../assets/icons/lower_abs_icon.png'),
  'obliques_icon.png': require('../assets/icons/obliques_icon.png'),
  'hip_flexors_icon.png': require('../assets/icons/hip_flexors_icon.png'),
  'chest_icon.png': require('../assets/icons/chest_icon.png'),
  'rhomboids_icon.png': require('../assets/icons/rhomboids_icon.png'),
  'lats_icon.png': require('../assets/icons/lats_icon.png'),
  'lower_back_icon.png': require('../assets/icons/lower_back_icon.png'),
  'triceps_icon.png': require('../assets/icons/triceps_icon.png'),
  'forearms_icon.png': require('../assets/icons/forearms_icon.png'),
  'biceps_icon.png': require('../assets/icons/biceps_icon.png'),
}

export function attribute() {

  <a href="https://www.flaticon.com/free-icons/muscle" title="muscle icons">Muscle icons created by cube29 - Flaticon</a>

}

export const FONTS = {
    HEADER: 'Geo-Regular',
    BODY: 'Electrolize-Regular'
}


export const styles = StyleSheet.create({

  headerText: {
    color: COLORS.TEAL, 
    fontSize: 32, 
    fontWeight: 'bold',
    fontFamily: 'Geo-Regular'
  },
  subText: {
    fontFamily: 'Electolize-Regular'
  },
  container: {
    flex: 1, 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    zIndex: 100,
    backgroundColor: COLORS.BACKGROUND,
    alignContent: 'center',
  },
  boxView: {

    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    borderColor: COLORS.BORDER,
    borderWidth: 3,
    padding: 2,
    marginHorizontal: 30,
    paddingTop: 25,
  },
  shopPic: {
    flex: 0,
    backgroundColor: COLORS.BACKGROUND,
    width: '100%',
    height: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  shopHeader: {
    width: '100%',
    height: '40%',
    paddingTop: '20%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
    
  },
  logout: {
    margin: 20,
    position: 'absolute',
    top: 20,
    left: 0,
    backgroundColor: COLORS.ALT, 
    marginTop: 30,
    //width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    paddingVertical: 6,
    alignSelf: 'center',
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    
  },
  button: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: COLORS.SECONDARY,
    borderColor: COLORS.BORDER,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '500'
  },
  buttonDisabled: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: COLORS.DARK_GRAY,
    borderColor: COLORS.BLACK,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '500'
  },
  buttonBig: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: COLORS.SECONDARY,
    borderColor: COLORS.BORDER,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.PRIMARY,
    fontSize: 20,
    fontWeight: '500'
  },
  buttonBigDisabled: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: COLORS.DARK_GRAY,
    borderColor: COLORS.BLACK,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.BLACK,
    fontSize: 20,
    fontWeight: '500'
  },
  altButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.ALT,
    borderColor: COLORS.BORDER,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.SECONDARY
  },
  titleView: {
    flex: 0,
    backgroundColor: COLORS.BACKGROUND,
    width: '100%',
    height: 200,
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
    backgroundColor: COLORS.BORDER, 
    marginVertical: 10, 
    alignSelf: 'center',
  },
  scrollableView: {
    paddingBottom: 75,
    rowGap: 20,
    flex: 0
  },
  CatSelector: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    height: (Dimensions.get('window').width) * 0.15,
    width: (Dimensions.get('window').width) * 0.15,      
  },
  ItemSelector: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    height: (Dimensions.get('window').width) * 0.25,
    width: (Dimensions.get('window').width) * 0.25,      
  },
  authContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  smallInput: {
    width: '40%',
    marginTop: 15,
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 20,
    height: 50
  },
  input: {
    width: '85%',
    margin: 3,
    marginTop: 15,
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 20,
    height: 50,
    fontFamily: 'Electrolize-Regular'
  },
  mt25: {
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
    
  },
  scrollWheel: {
    backgroundColor: '#f0f0f0',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 20,
    overflow: 'hidden', 
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: 20
  },
  singleQuest: {
    width: '80%',
    backgroundColor: '#20204b',
    padding: 10,
    borderRadius: 25,
    marginVertical: 5
  },
  ExercisePreview: {
    width: '75%',
    height: 40,
    backgroundColor: '#20204b',
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  exerciseNameText: {
    color: COLORS.TEAL,
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  exerciseText: {
    color: COLORS.PINK,
    fontSize: 14,
    height: '20%',
    marginLeft: 10
  },
  cardView: {
    flexDirection: 'row', 
    backgroundColor: COLORS.PURPLE, 
    borderRadius: "10%", 
    borderWidth: 2,
    borderColor: COLORS.PINK,
    width: '80%', 
    height: (Dimensions.get('window').height) * .15, 
    marginBottom: 25,
    padding: 10,
    paddingVertical: 15,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  infoWindow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    padding: 5,
    position: 'absolute',
    left: 15, 
  },
  closeButtonText: {
    fontSize: 24,
    color: '#606060',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEAL,
    alignSelf: 'flex-start',
    marginHorizontal: 15
  },
  modalView: {
    backgroundColor: COLORS.DARK_PURPLE,
    borderRadius: 10,
    borderColor: COLORS.BORDER,
    borderWidth: 2,
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignContent: 'center',
    width: '80%'
  
  }
})