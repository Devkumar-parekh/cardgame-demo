"use client";

import { getSocket } from "@/app/lib/socket";
import { Application, extend, useApplication, useTick } from "@pixi/react";
import { Assets, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { Fragment, useEffect, useRef, useState } from "react";

// const card

let cardtype = ["♠️", "♣️", "♦️", "❤️"];
let cardnumber = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

let cardDec = [];

function shuffleArray(arr: any, startpoint = 0) {
  for (let i = arr.length - 1; i > startpoint; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (arr[i]?.cardtype && arr[j]?.cardtype)
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  return arr;
}

for (let cardtypeindex = 0; cardtypeindex < 4; cardtypeindex++) {
  for (let i = 0; i < 13; i++) {
    const num = i; //Math.floor(Math.random() * 13);
    const typeIndex = cardtypeindex; //Math.floor(Math.random() * 4);

    cardDec.push({
      cardtype: cardtype[typeIndex],
      cardchar: cardnumber[num],
      text: `${cardnumber[num]} ${cardtype[typeIndex]}`,
    });
  }
}

const shuffledCards = shuffleArray(cardDec);

extend({ Container, Graphics, Sprite, Text });

const Table = () => {
  // return <pixi></>
  const { app } = useApplication();
  const tableRef = useRef<any>(null);
  // useTick(() => {
  //   if (!tableRef.current) return;
  //   tableRef.current.x += 1;
  //   if (tableRef.current.x === app.screen.width)
  //     tableRef.current.x = 0 - tableRef.current.width;
  // });

  return (
    <pixiGraphics
      ref={tableRef}
      draw={(g) => {
        if (!app) return;
        if (app)
          g.rect(0, 0, app.screen.width || 0, app.screen.height || 0).fill(
            "#123",
          );
      }}
    ></pixiGraphics>
  );
};

const Card = ({
  roomId,
  xposition = 0,
  yposition = 0,
  width = 45,
  height = 70,
  rotation = 0,
  index,
  carditem,
  containerRefs = null,
  openCards,
  setOpenCards,
}: any) => {
  const [texture, setTexture] = useState(null);
  const [cardDetails, setCardDetails] = useState({ cardnumber: null });

  useEffect(() => {
    const socket = getSocket();

    socket.on("card-played", (data) => {
      let temp = cardDetails;

      if (
        data.carditem.cardchar === carditem.cardchar &&
        data.carditem.cardtype === carditem.cardtype
      ) {
        setCardDetails((prev) => ({ ...prev, cardnumber: data.index }));
        setOpenCards((prev: any) => {
          if (cardInnerRef.current != null)
            cardInnerRef.current["cardchar"] = data.carditem.cardchar;
          prev.push(cardInnerRef);
          return prev;
        });
        // if (cardInnerRef.current && containerRefs.current) {
        //   cardInnerRef.current.x =
        //     containerRefs.current[data.player]?.children.length * 30 + 100;
        //   cardInnerRef.current.y = 0;

        //   containerRefs.current[data.player].addChild(cardInnerRef.current);
        // }
      }
      if (
        data.carditem.cardchar === carditem.cardchar &&
        data.carditem.cardtype !== carditem.cardtype
      ) {
        if (cardInnerRef.current && containerRefs.current) {
          if (temp?.cardnumber != null) {
            let containerwidth =
              containerRefs.current[data.player]?.children.length;
            cardInnerRef.current.x = containerwidth * 30 + 100;
            cardInnerRef.current.y = 0;
            if (containerRefs.current[data.player])
              containerRefs.current[data.player].addChild(cardInnerRef.current);

            setCardDetails((prev) => ({ ...prev, cardnumber: index }));

            setOpenCards((prev: any) => {
              let temp = prev.map((opercarditem: any) => {
                if (
                  !opercarditem.current.moved &&
                  opercarditem.current.cardchar === data.carditem.cardchar
                ) {
                  console.log(
                    opercarditem.current.cardchar,
                    opercarditem.current.moved,
                  );
                  opercarditem.current.x = (containerwidth + 1) * 30 + 100;
                  opercarditem.current.y = 0;
                  opercarditem.current.moved = true;
                  containerRefs.current[data.player].addChild(
                    opercarditem.current,
                  );

                  console.log(opercarditem.current.moved);

                  return opercarditem;
                }
                return opercarditem;
              });
              console.log(temp, "temp");
              return temp;
            });
          }
        }
      }
    });

    return () => {
      socket.off("server-message");
    };
  }, [cardDetails]);

  interface CardContainer extends Container {
    cardchar: string;
    moved: true | false;
  }
  const cardRef = useRef(null);
  const cardInnerRef = useRef<null | CardContainer>(null);
  useEffect(() => {
    Assets.load("/svg/card.svg").then(setTexture);
  }, []);

  if (!texture) return null;

  return (
    <>
      <pixiContainer
        ref={cardInnerRef}
        onPointerDown={() => {}}
        x={xposition}
        y={yposition}
      >
        {cardDetails?.cardnumber != null ? (
          <>
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.roundRect(0, 0, width, height, 5)
                  .fill({ color: 0xffffff })
                  .stroke({ width: 1, color: "gray" });
              }}
            />
            <pixiText
              // text={`${cardnumbers[cardDetails.cardnumber % 13]}\n ${cardType[cardDetails.cardnumber % 4]}`}
              text={`${carditem.text}`}
              anchor={0.5}
              x={width / 2}
              y={height / 2}
              style={{ fontSize: 18 }}
            />
          </>
        ) : (
          <pixiGraphics
            ref={cardRef}
            draw={(g) => {
              g.clear();
              g.roundRect(0, 0, width, height, 5).fill({ texture });
            }}
            eventMode="static"
            cursor="pointer"
            onPointerDown={() => {
              setCardDetails((prev) => ({ ...prev, cardnumber: index }));

              const socket = getSocket();

              socket.emit("play-card", {
                roomId: roomId,
                carditem,
                index,
              });
            }}
          />
        )}
      </pixiContainer>
    </>
  );
};

const Cards = ({ roomId, containerRefs }: any) => {
  const arr = Array(52).fill("A");
  const { app } = useApplication();
  const cardContainerRef = useRef<any>(null);
  let tempSizeY = 0;
  let xposition = 0;
  let yposition = 0;
  let width = 45;
  let height = 70;
  let rotation = 0;

  if (app.screen.height > app.screen.width) {
    return <>Game is not available this view</>;
  }

  useEffect(() => {
    if (cardContainerRef.current) {
      cardContainerRef.current.x = 100;
      cardContainerRef.current.y = 100;
    }
  }, []);

  const [openCards, setOpenCards] = useState([]);

  return (
    <>
      <pixiContainer onPointerDown={() => {}} ref={cardContainerRef}>
        {shuffledCards.map((carditem: any, index: any) => {
          if (app.screen.height < app.screen.width) {
            if (index % 13 === 0 && index != 0) tempSizeY++;
            width = (app.screen.width * 0.8) / 13 - 10;
            xposition = (index % 13) * (width + 15);
            height = width * 1.4; //(app.screen.height * 0.7) / 4;
            yposition = tempSizeY * (height + 10);
          } else {
            if (index % 4 === 0 && index != 0) tempSizeY++;

            height = (app.screen.width * 0.8) / 4 - 15;
            width = height * 0.6;
            yposition = tempSizeY * (width + 5) + width;

            xposition = (index % 4) * (height + 5);
            rotation = -Math.PI / 2;
          }
          return (
            <Card
              openCards={openCards}
              setOpenCards={setOpenCards}
              containerRefs={containerRefs}
              roomId={roomId}
              carditem={carditem}
              key={index}
              index={index}
              xposition={xposition}
              yposition={yposition}
              width={width}
              height={height}
              rotation={rotation}
            />
          );
        })}
      </pixiContainer>
    </>
  );
};
const MatchTheCard = () => {
  const [playerContainer, setPlayerContainer] = useState([]);
  const createRoom = () => {
    const socket = getSocket();

    socket.emit("create-room", (response: any) => {
      console.log("Room created:", response.roomId);
      setRoomid(response.roomId);
    });
  };

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        // expose PIXI globally
        window.PIXI = await import("pixi.js");
      }
    })();
  }, []);

  useEffect(() => {
    (() => {
      const socket = getSocket();
      socket.on("room-update", (data) => {
        console.log("Players in room:", data);
        setPlayerContainer(data.playerslist);
      });
    })();
  }, []);
  const [roomidField, setRoomidField] = useState("");
  const [roomid, setRoomid] = useState("");

  const joinRoom = (roomId: string) => {
    const socket = getSocket();

    socket.emit("join-room", { roomId }, (response: any) => {
      if (response.error) {
        console.log(response.error);
      } else {
        console.log("Joined room");
        setRoomid(roomidField);
      }
    });
  };

  const containerRefs = useRef<Record<string, Container | null>>({});

  const unsecuredCopyToClipboard = (text: any) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  };
  const copyToClipboard = (content: any) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    } else {
      unsecuredCopyToClipboard(content);
    }
  };
  return (
    <>
      <Application
        resizeTo={typeof window !== "undefined" ? window : undefined}
        background={"#123"}
      >
        {roomid ? (
          <pixiContainer>
            <Table />
            <pixiText
              eventMode="static"
              cursor="pointer"
              onPointerDown={() => copyToClipboard(roomid)}
              x={100}
              y={10}
              style={{ fill: "beige" }}
              text={roomid}
            />
            <Cards roomId={roomid} containerRefs={containerRefs} />
            {playerContainer?.map((item: any, index: number) => {
              return (
                <pixiContainer
                  ref={(el) => {
                    if (el) containerRefs.current[item] = el;
                  }}
                  key={index}
                  x={50}
                  y={index * 70 + 400}
                >
                  <pixiText text={`Player ${index + 1}`} />
                  {/* <pixiText text={`${item} ${index}`} /> */}
                </pixiContainer>
              );
            })}
          </pixiContainer>
        ) : (
          <pixiContainer>
            <pixiText
              x={100}
              y={100}
              style={{ fill: "beige" }}
              text={`Create Room`}
              cursor="pointer"
              eventMode="static"
              onPointerDown={createRoom}
            />
            <pixiText
              style={{ fill: "blue" }}
              x={100}
              y={150}
              text={`OR`}
              onPointerDown={createRoom}
            />
            <pixiText
              x={350}
              y={200}
              style={{ fill: "beige" }}
              text={`Join Room`}
              cursor="pointer"
              eventMode="static"
              onPointerDown={() => {
                joinRoom(roomidField);
              }}
            />
          </pixiContainer>
        )}
      </Application>
      {!roomid && (
        <>
          <input
            value={roomidField}
            onChange={(e) => setRoomidField(e.target.value)}
            placeholder="Enter Roomid..."
            style={{
              position: "absolute",
              top: 200,
              left: 100,
              width: 200,
              padding: 8,
              fontSize: 16,
            }}
          />
        </>
      )}
    </>
  );
};

export default MatchTheCard;
