import { Dimensions, StyleSheet } from "react-native"

export const COLORS = {
    BLACK: '#000000',
    DARK_GRAY: '#202020',
    TEAL: '#cbeef3',
    GRAY: '#404040',
    BACKGROUND_BLUE: '#10002b',
    CYAN: '#0D6B93',
    PINK: '#E113C5',
    PURPLE: '#550577',

    PRIMARY: '#6930C3',
    SECONDARY: '#80FFDB',
    BORDER: '#64DFDF',
    BACKGROUND: '#252525'
}

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.DARK_GRAY,
    alignContent: 'center',
  },
  boxView: {

    backgroundColor: COLORS.BACKGROUND_BLUE,
    borderRadius: 25,
    borderColor: COLORS.TEAL,
    borderWidth: 3,
    padding: 2,
    marginHorizontal: 30,
    paddingTop: 25,
  },
  shopPic: {
    flex: 0,
    backgroundColor: COLORS.GRAY,
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
    backgroundColor: COLORS.SECONDARY,
    borderColor: COLORS.BORDER,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.BACKGROUND
  },
  altButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.PURPLE,
    borderColor: COLORS.PINK,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.PINK
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
    backgroundColor: '#f0f0f0',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 20,
    height: 50
  },
  input: {
    width: '85%',
    margin: 3,
    marginTop: 15,
    backgroundColor: '#f0f0f0',
    borderColor: '#000000',
    borderWidth: 3,
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
    justifyContent: 'center'
  }
})