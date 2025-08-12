import { Dimensions, StyleSheet } from "react-native"


export const COLORS = {
    BLACK: '#000000',
    DARK_GRAY: '#202020',
    TEAL: '#cbeef3',
    
    CYAN: '#0D6B93',
    PINK: '#E113C5',
    PURPLE: '#550577',

    PRIMARY: '#10002b',
    SECONDARY: '#80FFDB',
    ALT: '#0D6B93',
    BORDER: '#64DFDF',
    BACKGROUND: '#151515',

    TRANSPURPLE: 'rgba(85, 5, 119, 0.25)'
}

export const styles = StyleSheet.create({

  container: {
    flex: 1,
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
    paddingBottom: 200,
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
    marginTop: 20,
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
    width: '80%',
    height: 60,
    backgroundColor: '#20204b',
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  exerciseNameText: {
    color: COLORS.TEAL,
    fontSize: 16,
    //paddingLeft: 2,
    textAlign: 'center', 
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
})