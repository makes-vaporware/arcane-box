import { spells } from "../data/spells.js";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Fab,
  List,
  ListItemButton,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import confetti from "canvas-confetti";

const toKebabCase = (spellName) =>
  spellName.toLowerCase().replace(/[\s/]+/g, "-");

const SpellList = () => {
  const { spellName } = useParams();

  return (
    <Paper sx={{ maxHeight: "100%", overflow: "auto", padding: "0px 20px" }}>
      <List component="nav">
        <ListSubheader>Spell List</ListSubheader>
        {spells.map((spell) => (
          <ListItemButton
            key={spell.name}
            selected={toKebabCase(spell.name) === spellName}
            component={Link}
            to={`/${toKebabCase(spell.name)}`}
          >
            {spell.name}
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

const SpellInfo = ({ spells }) => {
  const { spellName } = useParams();
  const spell = spells.find((spell) => toKebabCase(spell.name) === spellName);
  const spellLevelSchool = (spell) => {
    if (spell.level === "cantrip") return `cantrip ${spell.school}`;
    const suffix =
      spell.level === "1"
        ? "st"
        : spell.level === "2"
        ? "nd"
        : spell.level === "3"
        ? "rd"
        : "th";
    return `${spell.level}${suffix}-level ${spell.school}`;
  };

  return (
    <Paper
      sx={{
        height: "100%",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto",
        textAlign: "left",
      }}
    >
      {spell ? (
        <>
          <Typography variant="h4">{spell.name}</Typography>
          <Divider />

          <Typography sx={{ margin: "5px 0", fontStyle: "italic" }}>
            {spellLevelSchool(spell)}
          </Typography>

          <Box sx={{ margin: "10px 0", "& *": { margin: 0, padding: 0 } }}>
            <Markdown>{`**Casting Time:** ${spell.casting_time}`}</Markdown>
            <Markdown>{`**Range:** ${spell.range}`}</Markdown>
            <Markdown>{`**Components:** ${spell.components.raw}`}</Markdown>
            <Markdown>{`**Duration:** ${spell.duration}`}</Markdown>
          </Box>

          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, ...props }) => <Link to={`/${href}`} {...props} />,
            }}
          >
            {spell.description}
          </Markdown>
        </>
      ) : (
        <Typography>Select a spell to know more about it.</Typography>
      )}
    </Paper>
  );
};

const EasterEggCard = ({ N, count, setCount, spellName }) => {
  const [open, setOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const checkAnswer = () => {
    if (count === 0) {
      confetti();
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const spellCount = (spellName) => {
    const spell = spells.find((spell) => toKebabCase(spell.name) === spellName);
    if (!spell) return 0;

    const schools = {
      abjuration: 2,
      conjuration: 3,
      divination: 5,
      enchantment: 7,
      evocation: 11,
      illusion: 13,
      necromancy: 17,
      transmutation: 21,
    };
    const spellLevel = spell.level === "cantrip" ? 0 : Number(spell.level);
    return schools[spell.school] ^ spellLevel;
    // return (schools[spell.school] ** spellLevel ) % N;
  };

  return (
    <Box>
      <Fab
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        {open ? <ExpandLess /> : <ExpandMore />}
      </Fab>

      <Collapse in={open}>
        <Card
          sx={{
            position: "fixed",
            bottom: 85,
            right: 20,
            width: 300,
            boxShadow: 4,
          }}
        >
          <CardContent>
            <Typography>PUZZLE</Typography>
            <Typography variant="h2">
              {count === 0
                ? N.toString(16)
                : count.toString(16).padStart(2, "0")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: "5px",
              }}
            >
              <Button
                variant="outlined"
                sx={{ "&:focus": { outline: "none" } }}
                onClick={() =>
                  setCount((count) => (count + spellCount(spellName)) % N)
                }
              >
                Cast Spell
              </Button>
              <Button
                variant="outlined"
                sx={{ "&:focus": { outline: "none" } }}
                className={isShaking ? "horizontal-shaking" : ""}
                onClick={checkAnswer}
              >
                Check
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
};

const SpellViewer = () => {
  const { spellName } = useParams();
  const N = 94;
  const [count, setCount] = useState(Math.floor(Math.random() * 94));

  return (
    <Box>
      <Typography variant="h3" align="left">
        D&D 5e Spell Compendium
      </Typography>
      <Divider sx={{ margin: "15px 0px" }} />
      <EasterEggCard
        N={N}
        count={count}
        setCount={setCount}
        spellName={spellName}
      />
      <Box sx={{ maxHeight: "70vh", display: "flex", gap: "20px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 4fr",
            gap: "20px",
          }}
        >
          <SpellList />
          <SpellInfo spells={spells} />
        </Box>
      </Box>
    </Box>
  );
};

export { SpellViewer };
