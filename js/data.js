// 프로젝트 데이터
// 실제 사진 업로드 전까지는 컬러 그라디언트 플레이스홀더로 표시됨.

const PROJECTS = [{
  id: "mercedes-benz-pullman",
  name: "Mercedes-Benz Pullman",
  tagline: "Mercedes-benz Pullman / wip",
  cover: "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783607790/npbtlw0otakbn7edkmi4.png",
  images: [
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602314/ne4o9ebtcojex5ebb6ve.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602317/bpfcs6v8xreuoaqkzsxq.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602319/sgv5lrt5ipzgutcmzfuw.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602332/sqxvmp50fv1joqsywvpu.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602334/rfelyl2smxcimmljeafc.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602335/n3qetkkaibhrx9r58uky.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602336/ynr8qmt0mdigabpocmo7.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602339/f8zrw7zh9cyuwfuihvmw.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602341/ywqikkb0qyx7z3to7zco.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602346/qmheybb8wdktgobwzcwe.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602350/otczo557cptsxkfeipno.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602357/lwyw4nmpittqlgtybruy.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602360/zmbrjuurihvkjhsenlzz.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602362/gumj1grzlak6lcbbqjvh.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783602362/kgyx8zdtxipmylmx4swt.png"
  ]
},
 {
  id: "chevrolet-firebird-iv",
  name: "Chevrolet Firebird IV",
  tagline: "Reinterpretating Chevrolet Firebird IV",
  cover: "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603814/u59ufomfqssnpvvaw77v.png",
  images: [
"https://res.cloudinary.com/jurxftky/video/upload/q_auto,f_auto/v1783670590/ltm0pv2xsoit88lpg6ft.mp4",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603072/cu1dh2kblgdfiaj29uuo.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603074/znrizlh72rn200kklmop.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603104/ldbrxzejxygtl5pbywk6.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603108/ygwvvswpttunccvacd4z.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603112/md6dvpl2gih628mq3cfu.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603114/bcffjsmc2nvtw9c5lhv5.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603116/xkvtmggugixs0r7yxihn.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603118/gmcervckxe07yybh6gpf.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603461/gtb2p4v56bfyczjd8msu.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603124/jjj5klbykkz9y77eyfv8.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603128/vxsuvqsowz3na15i7sm5.png",
"https://res.cloudinary.com/jurxftky/video/upload/q_auto,f_auto/v1783670400/nhngie9fgkivnjsshtgu.mp4",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603137/dkijbsxbsehvh9u3nnpm.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603138/fglewsumj4n4mddf7zys.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603141/zdtzglzp5hquymcwdu28.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603144/blxl58yqn1hz6fruq9mv.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783603153/qz4md6loduni9ew8oiyv.png"

  ]
}, {
  id: "hyundai-hexagon",
  name: "Hyundai Hexagon",
  tagline: "Hyundai Extreme Adventure",
  cover: "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604650/hrb0ug4cole7bycqns6g.png",
  images: [
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604556/edt58zahdw4ewdx9ubcl.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604560/plky4xuatr496wqxjcwi.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604566/xasv4vzqef3nyw9ahtus.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604569/jkv7n4ehfzusr30xu7bm.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604571/ncjlflalincf4rljr0yn.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604573/z5gu4dbjqkqepq857ejj.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604573/cnyqkttvwmctf7aq5trh.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604574/z0t2tuois9yktoihfdbp.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604577/fcerwayng2okdrbi0pcb.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604579/sdogf6djkfgkhk31bedx.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604581/it8cstv3dxsvfehkq1fn.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604582/ln4zg7fyravxcyppbxu5.png"
  ]
}, {
  id: "h-mobility",
  name: "H-MOBILITY",
  tagline: "Drive system & Mobility Life style Exploration",
  cover: "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605191/kg2mu8jet8mdhgzpfhvf.png",
  images: [
    "https://res.cloudinary.com/jurxftky/video/upload/q_auto,f_auto/v1783836115/mlbpzi2vegy4pwkwfzgx.mp4",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604895/bjqlwhmsggqlrodry70o.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604907/ns7mmd0h6cfcg9fpqvfs.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604908/qs060xocjlqntzgez6r0.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604909/rmbutzl60l5vhsfljpq1.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604910/g9wvfaa2zwsaexpx3aca.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604912/pw1rbtjoy3kmegfgrl76.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604918/vljuczievssgbungemg8.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604920/e3ryvjctfoxgbkdymyfm.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604923/qeikn7hbnd3naf64jk3c.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604926/mhqewa7wi9abxlasspmu.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604929/cvhyo4cegmhxtbvbxfha.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604937/sbqmtx0r5lmfwpe7hoxh.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604938/btp5jxywbynf9ogfpx09.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604941/mcpedqhgvfnz8ighkytf.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604944/sb6dahq87eza7gvlmycg.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604948/k5fwwx62vxgrbikhiwsr.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604950/lhoat8yrqdlhnhqkiju3.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604952/khfpzlx94ltjuilyay9r.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783604955/gsyqyzxf6qg7gydvq811.png"
  ]
},
 {
  id: "random-sketches",
  name: "Random Sketches",
  tagline: "",
  cover: "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605260/kjaayklb12obq0en1tef.png",
  images: [
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605260/kjaayklb12obq0en1tef.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605265/hbwk6sjhjtdampyhvrje.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605269/uhsbx0lrepdcxbfysi2g.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605272/hoxomwns4dhoxybncgf5.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605274/rwjnssmttkwxpnrkmc85.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605278/nifk8msjrdzdvaflfzhu.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605279/vbovwxqmnmo02pmwpzpa.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605281/nqbn50vzaflnlfwqbrvt.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605287/sr1u37xc2na9acyqjv20.png",
    "https://res.cloudinary.com/jurxftky/image/upload/q_auto,f_auto/v1783605290/ui9tnwqu895xt6ov15ro.png"
  ]
}
];
