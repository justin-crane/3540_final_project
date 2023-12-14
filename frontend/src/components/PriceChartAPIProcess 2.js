import axios from "axios";
let dataReturn;

export const getGame = async (data, gameFormData) => {
    try {
        const res = await
            axios.post(`http://localhost:3000/api/price/${data.name}/${data.gameConsole}/`);

        if (!data.price){
            switch(gameFormData.formCondition){
                case "1":
                    data.price = (res.data['loose-price']/100);
                    //console.log("SETTING PRICE AS CONDITION 1");
                    break;
                case "2":
                    data.price = (res.data['retail-cib-buy']/100);
                    //console.log("SETTING PRICE AS CONDITION 2");
                    break;
                case "3":
                    data.price = (res.data['retail-cib-sell']/100);
                    //console.log("SETTING PRICE AS CONDITION 3");
                    break;
                case "4":
                    data.price = (res.data['retail-new-buy']/100);
                    //console.log("SETTING PRICE AS CONDITION 4");
                    break;
                case "5":
                    data.price = (res.data['new-price']/100);
                    //console.log("SETTING PRICE AS CONDITION 5");
                    break;
                default:
                    data.price = (res.data['loose-price']/100);
                    //console.log("SETTING PRICE AS CONDITION DEFAULT");
                    break;
            }
        }
        data['genre'] = res.data['genre'];
        data['release-date'] = res.data['release-date'];
        data['gameConsole'] = res.data['console-name'];
        data['genre'] = res.data['genre'];
        dataReturn = data;

    } catch (e) {
        console.log(e);
    }

    return dataReturn;
}
