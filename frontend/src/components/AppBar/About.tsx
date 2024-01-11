import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Link,
} from "@mui/material";

interface Props {
  onClose: () => void;
}

const About = (props: Props) => {
  const { onClose } = props;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth={true}>
      <DialogTitle>About this website</DialogTitle>
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
        這個網站旨在記錄九澤cp和五堅情的經典語錄和場景
        <br />
        希望這裡可以方便新粉舊粉快速找到他們想找的影片片段或社群貼文，也方便剪片的人找資料
        <p></p>
        網站使用方法請參考我的Instagram貼文和影片
        <p></p>
        現在網站裡大多資料和tag都是關於九澤,
        但是歡迎添加任何五堅情成員或cp的資料
        <p></p>
        如果有什麼建議、發現bug、想加入我一起開發這個app等等可以通過Instagram聯繫我:
        lemonade0407
        <p></p>
        This website is developed using React, Springboot Java, MySQL, and
        hosted on Google cloud app engine.
        <br />
        The source code can be found at{" "}
        <Link
          href="https://github.com/yingxuanchen/meltiverse"
          underline="hover"
          target="_blank"
          rel="noopener"
        >
          https://github.com/yingxuanchen/meltiverse
        </Link>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default About;
