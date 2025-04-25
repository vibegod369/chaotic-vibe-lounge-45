
import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import GlitchText from "@/components/GlitchText";
import ReactMarkdown from 'react-markdown';

const Whitepaper = () => {
  // Store whitepaper content as markdown - this makes it easy to update
  const [whitepaperContent] = useState(`
## Vibe Coded Caos Dao Whitepaper  

### Introduction  
Vibe Coded Caos Dao is a Web3 project designed to embrace the rough, spontaneous, and unrefined nature of vibe coding. It leverages the chaotic and resilient ethos of decentralized development to showcase the robustness of blockchain technology. Vibe Coded Caos Dao provides a platform for builders and users to launch their own vibe-coded projects via our token contract factory, fueled by the $VIBE token.  

### Vision  
Vibe Coded Caos Dao is a celebration of the raw, unfiltered spirit of blockchain innovation. It thrives on the principle that experimentation and rough execution are vital elements of the decentralized space. By fostering a community of vibe coders, Vibe Coded Caos Dao aims to attract a diverse range of builders who embrace the imperfection and creativity inherent in Web3 development.  

### Tokenomics  
- **Token Name:** VIBE  
- **Blockchain:** Ethereum (with cross-chain bridge support)  
- **Total Supply:** 1 billion VIBE  
- **Buy Tax:** 0%  
- **Sell Tax:** 5%  
- **Trading Pairs:** VIBE is the only trading pair for new tokens launched on the platform.  
- **Launch Strategy:** Fair launch on Ethereum.  

### Key Features  

#### Fair Token Launch  
The VIBE token will be launched through a fair and transparent process on Ethereum. The initial distribution will prioritize community participation, and no tokens will be reserved for private sales or pre-launch allocations.  

#### Project Launchpad  
Builders can launch their vibe-coded projects using the VIBE contract factory. To initiate a launch, builders must provide VIBE as liquidity, ensuring the token's utility and stability.  

#### Vibe Contributor (VC) Mechanism  
VCs (Vibe Contributors) are community members who stake their VIBE/ETH Uniswap V2 LP tokens to support new projects.  
- **Staking:** VCs stake their LP tokens to vote for projects they believe in.  
- **Voting Options:**  
  - *Stake:* Vote for a project by staking LP tokens.  
  - *Pass:* Indicate disinterest or that the fund is already deployed.  
  - *Too Early:* Signal that the project needs more development.  
  - *Share:* Introduce the project to a contact who might be interested (e.g., "I'm going to introduce you to my friend Mike, he'll love this").  
- **Rewards:** All staked tokens earn VIBE rewards, regardless of which project they support.  
- **Project Prioritization:** Projects with the highest stakes move to the top and become eligible for launch once they hit the threshold.  

#### Vibe DEX  
A decentralized exchange where VIBE is the primary trading pair. All new vibe-coded projects launched through the platform will be traded using VIBE, creating consistent demand and liquidity.  

#### Deal Room  
An interactive space where VCs and users can view projects proposed for backing.  
- **Project Details:**  
  - Name  
  - Description  
  - Team Information  
  - Demo  
  - Links  
- **Engagement:** Users can discuss projects and track their progress in real-time.  

#### Chaos DAO  
A decentralized governance system powered by Snapshot. Holders of VIBE can participate in governance decisions, propose changes, and vote on key platform updates.  

#### Forums  
An open-source forum plug-in will be used to create a vibe coding discussion area where builders can share insights, troubleshoot, and discuss ideas.  

#### Wallet Connect  
Seamless integration with Web3 wallets, allowing users to connect and interact with all aspects of the Vibe Coded Caos Dao ecosystem.  

### Roadmap  
- **Phase 1: Launch Preparation**  
  - Finalize the token contract and contract factory.  
  - Build the Vibe DEX and initial UI.  
  - Deploy the Chaos DAO on Snapshot.  
  - Integrate Wallet Connect and forums.  

- **Phase 2: Launch**  
  - Execute the fair launch of the VIBE token.  
  - Open the Deal Room and allow project proposals.  
  - Activate staking and VC voting.  

- **Phase 3: Growth and Cross-Chain Expansion**  
  - Integrate bridge support for additional chains.  
  - Attract builders and foster vibe coding culture through community events and incentives.  

### Conclusion  
Vibe Coded Caos Dao is a pioneering project that turns chaos into creativity, leveraging the resilient nature of blockchain to build a community-driven innovation platform. Join us as we embrace the vibe coding revolution and prove the robustness of decentralized technology.
`);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">
              <GlitchText text="Whitepaper" color="neon" />
            </h1>
            <p className="text-gray-400">
              The vision and roadmap for Vibe Coded Chaos DAO
            </p>
          </div>

          <div className="card-chaos p-8">
            <div className="prose prose-invert prose-headings:text-vibe-neon prose-a:text-vibe-pink max-w-none">
              <ReactMarkdown>
                {whitepaperContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Whitepaper;
