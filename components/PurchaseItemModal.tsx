import { Session } from "@supabase/supabase-js";
import { Item } from "../lib/Item";
import { Profile } from "../lib/profile";
import { Modal, Pressable, View, Text, Image } from "react-native";
import { COLORS, FONTS, imageMap, styles } from "../app/costants";

export default function PurchaseModal( 
    props: {
        session: Session | null,
        item: Item | null,
        showModal: boolean,
        onClose: () => void,
        onPurchase: (item: any) => void,
        profile: Profile | null
    }
) {

    if (!props.item) return null;

    const canAfford = props.profile?.gold_count !== undefined ? 
        props.profile.gold_count >= props.item.price 
    : 
        true


  const handlePurchase = () => {
    if (canAfford) {
      props.onPurchase(props.item);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.showModal}
      onRequestClose={props.onClose}
    >
        <View 
            style={[
                styles.container,
                { flex: 1, zIndex: 2, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'
                }
            ]}
        >
            <View style={styles.modalView}>

                <Pressable 
                    style={{ position: 'absolute', left: 10, top: 10, backgroundColor: COLORS.BORDER, borderRadius: 5, borderColor: COLORS.BORDER, borderWidth: 1 }}
                    onPress={ props.onClose }
                >
                    <Text> X </Text>
                </Pressable>

            
                <View style={{ width: 80, height: 80, marginTop: 10, marginBottom: 15, alignSelf: 'center'}}>
                    <Image 
                        style={{ resizeMode: 'contain', width: '100%', height: '100%'}} 
                        source={imageMap[props.item.icon_url]} 
                    />
                </View>

                <Text style={[styles.headerText, { textAlign: 'center'}]}>
                    {props.item.name}
                </Text>

                
                <Text style={[{ fontFamily: FONTS.BODY,fontSize: 16, textAlign: 'center', marginBottom: 15, fontWeight: '600', color: COLORS.CYAN }]}>
                    {props.item.rarity.charAt(0).toUpperCase() + props.item.rarity.slice(1)}
                </Text>


                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20,}}>
                    <Text style={{color: COLORS.CYAN, fontFamily: FONTS.BODY, fontSize: 18,}}>Price: </Text>
                    <Text style={{color: COLORS.GOLD, fontFamily: FONTS.HEADER, fontSize: 20, fontWeight: 'bold',}}>{props.item.price}</Text>
                </View>


                {props.item.effect && (
                    <View style={{width: '100%', marginBottom: 15,}}>
                    <Text style={{color: COLORS.TEAL, fontFamily: FONTS.HEADER, fontSize: 16, marginBottom: 5, fontWeight: 'bold',}}>Effect:</Text>
                    <Text style={{color: COLORS.BORDER, fontFamily: FONTS.BODY, fontSize: 14, lineHeight: 20, textAlign: 'left',}}>{props.item.effect}</Text>
                    </View>
                )}

              
                {props.item.description && (
                    <View style={{width: '100%', marginBottom: 15,}}>
                    <Text style={{color: COLORS.TEAL, fontFamily: FONTS.HEADER, fontSize: 16, marginBottom: 5, fontWeight: 'bold',}}>Description:</Text>
                    <Text style={{color: COLORS.BORDER, fontFamily: FONTS.BODY, fontSize: 14, lineHeight: 20, textAlign: 'left',}}>{props.item.description}</Text>
                    </View>
                )}


                <Pressable 
                    style={[
                        styles.button, 
                        !canAfford && styles.buttonDisabled
                    ]} 
                    onPress={handlePurchase}
                    disabled={!canAfford}
                    >
                    <Text style={{ fontSize: 20, fontFamily: FONTS.BODY}}>
                        {canAfford ? 'Purchase' : 'Insufficient Gold'}
                    </Text>
                </Pressable>

            </View>
        </View>
    </Modal>
  );
}