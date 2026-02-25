"use client";

import { getSocket } from "@/app/lib/socket";
import { Application, extend, useApplication } from "@pixi/react";
import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { useEffect, useRef, useState } from "react";

/* ============================= */
/* Card Constants */
/* ============================= */

const cardtype = ["♠️", "♣️", "♦️", "❤️"];
const cardnumber = [
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

type CardItem = {
  cardtype: string;
  cardchar: string;
  text: string;
};

const cardDec: CardItem[] = [];

function shuffleArray(arr: CardItem[], startpoint = 0) {
  for (let i = arr.length - 1; i > startpoint; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (arr[i]?.cardtype && arr[j]?.cardtype) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

for (let t = 0; t < 4; t++) {
  for (let i = 0; i < 13; i++) {
    cardDec.push({
      cardtype: cardtype[t],
      cardchar: cardnumber[i],
      text: `${cardnumber[i]} ${cardtype[t]}`,
    });
  }
}

const shuffledCards = shuffleArray(cardDec);

extend({ Container, Graphics, Sprite, Text });

/* ============================= */
/* Table Component */
/* ============================= */

const Table = () => {
  const { app } = useApplication();
  const tableRef = useRef<Graphics | null>(null);

  return (
    <pixiGraphics
      ref={tableRef}
      draw={(g) => {
        if (!app) return;
        g.clear();
        g.rect(0, 0, app.screen.width, app.screen.height).fill("#123");
      }}
    />
  );
};

/* ============================= */
/* Card Component */
/* ============================= */

interface CardContainer extends Container {
  cardchar?: string;
  moved?: boolean;
}

interface CardProps {
  roomId: string;
  xposition: number;
  yposition: number;
  width: number;
  height: number;
  rotation: number;
  index: number;
  carditem: CardItem;
  containerRefs: React.MutableRefObject<Record<string, Container | null>>;
  openCards: OpenCard[];
  setOpenCards: React.Dispatch<React.SetStateAction<OpenCard[]>>;
}

const Card = ({
  roomId,
  xposition,
  yposition,
  width,
  height,
  index,
  carditem,
  containerRefs,
  setOpenCards,
}: CardProps) => {
  const [texture, setTexture] = useState<any>(null);
  const [cardDetails, setCardDetails] = useState<{ cardnumber: number | null }>(
    {
      cardnumber: null,
    },
  );
  const [isopen, setIsopen] = useState(false);

  const cardInnerRef = useRef<CardContainer | null>(null);

  /* Load texture */
  useEffect(() => {
    Assets.load("/svg/card.svg").then(setTexture);
  }, []);

  /* Socket Listener */
  useEffect(() => {
    const socket = getSocket();

    const handleCardPlayed = (data: any) => {
      if (
        data.carditem.cardchar === carditem.cardchar &&
        data.carditem.cardtype === carditem.cardtype
      ) {
        setCardDetails({ cardnumber: data.index });
        setIsopen(true);
        // setOpenCards(cardInnerRef)

        if (cardInnerRef.current) {
          cardInnerRef.current.cardchar = data.carditem.cardchar;
        }
      }

      if (isopen) console.log(carditem.cardchar);

      if (
        data.carditem.cardchar === carditem.cardchar &&
        data.carditem.cardtype !== carditem.cardtype
      ) {
        if (!cardInnerRef.current) return;
        console.log(cardDetails.cardnumber, "cardDetails.cardnumber");
        const container = containerRefs.current[data.player];
        if (!container) return;

        const containerwidth = container.children.length;

        cardInnerRef.current.x = containerwidth * 30 + 100;
        cardInnerRef.current.y = 0;
        cardInnerRef.current.moved = true;
        container.addChild(cardInnerRef.current);

        setCardDetails({ cardnumber: index });
      }
    };

    socket.on("card-played", handleCardPlayed);
    return () => {
      socket.off("card-played", handleCardPlayed);
    };
  }, [carditem, index, containerRefs]);

  if (!texture) return null;
  // const moveToPlayerContainer = (card: CardContainer) => {
  //   const container = containerRefs.current["playerId"]; // your player id
  //   if (!container) return;

  //   const position = container.children.length;

  //   card.x = position * 30 + 100;
  //   card.y = 0;

  //   container.addChild(card);
  // };

  return (
    <pixiContainer
      ref={cardInnerRef}
      x={xposition}
      y={yposition}
      eventMode="static"
      // onPointerDown={() => {
      //   setCardDetails({ cardnumber: index });

      //   if (!cardInnerRef.current) return;

      //   const currentCard = {
      //     ref: cardInnerRef.current,
      //     cardchar: carditem.cardchar,
      //     moved: false,
      //   };

      //   setOpenCards((prev) => {
      //     const updated = [...prev, currentCard];

      //     // If 2 cards opened → check match
      //     if (updated.length === 2) {
      //       const [first, second] = updated;

      //       if (
      //         first.cardchar === second.cardchar &&
      //         !first.moved &&
      //         !second.moved
      //       ) {
      //         // MATCH FOUND
      //         moveToPlayerContainer(first.ref);
      //         moveToPlayerContainer(second.ref);

      //         first.moved = true;
      //         second.moved = true;
      //       }

      //       return [];
      //     }

      //     return updated;
      //   });

      //   const socket = getSocket();
      //   socket.emit("play-card", {
      //     roomId,
      //     carditem,
      //     index,
      //   });
      // }}
    >
      {cardDetails.cardnumber != null ? (
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
            text={carditem.text}
            anchor={0.5}
            x={width / 2}
            y={height / 2}
            style={{ fontSize: 18 }}
          />
        </>
      ) : (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.roundRect(0, 0, width, height, 5).fill({ texture });
          }}
          eventMode="static"
          cursor="pointer"
          onPointerDown={() => {
            setCardDetails({ cardnumber: index });

            const socket = getSocket();
            socket.emit("play-card", {
              roomId,
              carditem,
              index,
            });
          }}
        />
      )}
    </pixiContainer>
  );
};

/* ============================= */
/* Cards Component */
/* ============================= */

interface OpenCard {
  ref: CardContainer;
  cardchar: string;
  moved: boolean;
}
const Cards = ({
  roomId,
  containerRefs,
}: {
  roomId: string;
  containerRefs: React.MutableRefObject<Record<string, Container | null>>;
}) => {
  const { app } = useApplication();
  const cardContainerRef = useRef<Container | null>(null);
  const [openCards, setOpenCards] = useState<OpenCard[]>([]);

  if (!app || app.screen.height > app.screen.width) {
    return <>Game is not available this view</>;
  }

  useEffect(() => {
    if (cardContainerRef.current) {
      cardContainerRef.current.x = 100;
      cardContainerRef.current.y = 100;
    }
  }, []);

  return (
    <pixiContainer ref={cardContainerRef}>
      {shuffledCards.map((carditem, index) => {
        const width = (app.screen.width * 0.8) / 13 - 10;
        const height = width * 1.4;

        const row = Math.floor(index / 13);
        const col = index % 13;

        const xposition = col * (width + 15);
        const yposition = row * (height + 10);

        return (
          <Card
            key={index}
            roomId={roomId}
            carditem={carditem}
            index={index}
            xposition={xposition}
            yposition={yposition}
            width={width}
            height={height}
            rotation={0}
            containerRefs={containerRefs}
            openCards={openCards}
            setOpenCards={setOpenCards}
          />
        );
      })}
    </pixiContainer>
  );
};

/* ============================= */
/* Main Component */
/* ============================= */

const MatchTheCard = () => {
  const [roomid, setRoomid] = useState("");
  const [roomidField, setRoomidField] = useState("");
  const [playerContainer, setPlayerContainer] = useState<string[]>([]);
  const [playerid, setPlayerid] = useState("");
  const containerRefs = useRef<Record<string, Container | null>>({});

  const socket = getSocket();

  const createRoom = () => {
    socket.emit("create-room", (response: any) => {
      setRoomid(response.roomId);
      setPlayerid(response.playerid);
    });
  };

  const joinRoom = (roomId: string) => {
    socket.emit("join-room", { roomId }, (response: any) => {
      if (!response.error) setRoomid(roomId);
      setPlayerid(response.playerid);
    });
  };

  useEffect(() => {
    socket.on("room-update", (data: any) => {
      setPlayerContainer(data.playerslist);
    });

    return () => {
      socket.off("room-update");
    };
  }, [socket]);

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
              x={100}
              y={10}
              text={roomid}
              eventMode="static"
              cursor="pointer"
              onPointerDown={() => {
                console.log("ok");
                copyToClipboard(roomid);
              }}
              style={{ fill: "beige" }}
            />
            <pixiText
              x={100}
              y={50}
              text={playerid}
              style={{ fill: "beige" }}
            />

            <Cards roomId={roomid} containerRefs={containerRefs} />

            {playerContainer.map((item, index) => (
              <pixiContainer
                key={index}
                ref={(el) => {
                  if (el) containerRefs.current[item] = el;
                }}
                x={50}
                y={index * 70 + 400}
              >
                <pixiText text={`Player ${index + 1}`} />
              </pixiContainer>
            ))}
          </pixiContainer>
        ) : (
          <pixiContainer>
            <pixiText
              x={100}
              y={100}
              style={{ fill: "beige" }}
              text="Create Room"
              cursor="pointer"
              eventMode="static"
              onPointerDown={createRoom}
            />
            <pixiText
              x={350}
              y={200}
              style={{ fill: "beige" }}
              text="Join Room"
              cursor="pointer"
              eventMode="static"
              onPointerDown={() => joinRoom(roomidField)}
            />
          </pixiContainer>
        )}
      </Application>

      {!roomid && (
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
      )}
    </>
  );
};

export default MatchTheCard;
