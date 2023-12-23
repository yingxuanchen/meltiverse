import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
} from "@mui/material";

interface Props {
  onClose: () => void;
}

const About = (props: Props) => {
  const { onClose } = props;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth={true}>
      <DialogTitle>About this app</DialogTitle>
      <DialogContent>
        五堅情的無間宇宙
        <br />
        Meltiverse is a pun on multiverse, meaning their universes melt together
        to form 1
        <br />
        無間宙聽起來也像沒有“間奏”, 剛好也對應到"verse"
        <p></p>
        我是邱鋒澤、九澤cp、五堅情的粉絲
        <p></p>
        其實一開始是想做個timeline app紀錄九澤cp和五堅情發生的一切,
        但能力不足所以放棄了
        <br />
        有時想剪一些九澤cp集錦影片, 但要記得哪些事在什麼時候哪個影片裡發生太難,
        就開始用excel紀錄, 然後發現還是太沒效率了, 然後這個app就誕生了
        <p></p>
        現在大多tag都是關於九澤, 但是歡迎添加任何五堅情成員或cp的tag
        <p></p>
        如果想加影片(material)或tag必須登入, 如想更改或刪除請聯繫我
        <br />
        自己可以更改或刪除自己加的影片tag(material tag)
        <p></p>
        如果有什麼建議、發現bug、想加入我一起開發這個app等等可以通過Instagram聯繫我:
        lemonade0407
        <p></p>
        This app is developed using React, Springboot Java, MySQL.
        <br />
        The source code can be found at
        https://github.com/yingxuanchen/meltiverse.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default About;
