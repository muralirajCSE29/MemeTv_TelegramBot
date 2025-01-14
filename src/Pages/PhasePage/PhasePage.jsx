import React, { useEffect, useState } from "react";
import stakelogo from "../../assets/images/stake-logo.svg";
import logo from "../../assets/images/main-logo.svg";
import "./PhasePage.css";
import { weekRewards, stakeRewards } from "../../apis/user";
import useUserInfo from "../../Hooks/useUserInfo";

const PhasePage = () => {
  const { userDetails } = useUserInfo();
  const [currentLevel, setCurrentLevel] = useState(
    userDetails?.userDetails?.currentPhase
  );
  const [TotalRewards, setTotalRewards] = useState(0);

  const formatNumber = (num) => {
    if (num >= 1000000) return Math.floor(num / 100000) / 10 + "M";
    if (num >= 1000) return Math.floor(num / 100) / 10 + "k";
    return num;
  };

  const [stakeDetails, setStakeDetails] = useState({});
  const [currentStake, setCurrentStake] = useState({});
  const week = {
    1: "week1",
    2: "week2",
    3: "week3",
    4: "week4",
    5: "week5",
    6: "week6",
    7: "week7",
    8: "week8",
    9: "week9",
    10: "week10",
  };

  const getWeeklyRewardsData = async () => {
    const data = {
      telegramId: userDetails?.userDetails?.telegramId,
    };
    const responce = await weekRewards(data);
    setStakeDetails(responce);
  };

  useEffect(() => {
    getWeeklyRewardsData();
  }, []);

  useEffect(() => {
    if (stakeDetails) {
      const currWeek = week[currentLevel];
      const res = stakeDetails[currWeek];
      setCurrentStake(res);
    }
  }, [stakeDetails, currentLevel]);

  useEffect(() => {
    const value = currentStake?.rewardsForWeek?.reduce((acc, item) => {
      return item.userStaking ? acc + item.totalRewards : acc;
    }, 0);

    setTotalRewards(value);
  }, [currentStake]);

  const updateStakeRewards = (id) => {
    const res = stakeRewards({ stakingId: String(id) });
    if (res) {
      setTimeout(() => {
        getWeeklyRewardsData();
      }, 1500);
    }
  };
  return (
    <>
      <div className="info-img scroll">
        <div
          className="menupointer stuff-body1"
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginTop: "15%",
            flexDirection: "column",
            pointerEvents: "all",
          }}
        >
          <div
            onClick={() => {
              if (currentLevel > 1) {
                setCurrentLevel(currentLevel - 1);
              }
            }}
            class={currentLevel > 1 ? "arrows prevact" : "arrows prev"}
          ></div>
          <div
            class="arrows next"
            onClick={() => {
              if (currentLevel < 10) {
                setCurrentLevel(currentLevel + 1);
              }
            }}
          ></div>
          <div className="phase">
            <div className="row phaseContainer">
              <div className="col-6">
                <h1 className="phase-text">PHASE {currentLevel}</h1>
              </div>
              <div className="col-6">
                <h3 className="phase-point">
                  <img src={logo} />{" "}
                  {formatNumber(currentStake?.totalWeeklyRewards)}
                </h3>
              </div>
            </div>
            <div className="row justify-content-center">
              <div
                className="col-11 p4 stake-display justify-content-center"
                style={{ padding: "5px" }}
              >
                <div className="col-8">
                  <h2>Total Staked</h2>
                </div>
                <div className="col-4">
                  <p className="phase-para">
                    <img src={logo} /> {formatNumber(TotalRewards)}
                  </p>
                </div>
              </div>
            </div>
            {currentStake?.rewardsForWeek?.map((item, index) => {
              return (
                <div className="row mt10 phase-stuff" style={{ width: "100%" }}>
                  <div className="col-2">
                    <div>
                      <h2 className="stake-days">
                        DAY
                        <h3 className="stake-color">{index + 1}</h3>
                      </h2>
                    </div>
                  </div>
                  <div className="col-7 stuff-text">
                    <p className="phase-para">
                      <img src={stakelogo} /> {formatNumber(item?.totalRewards)}
                    </p>
                  </div>
                  <div className="col-3">
                    {item?.userStaking ? (
                      <button className="stuff-unclaim">STAKED</button>
                    ) : null}
                    {item?.totalRewards === 0 ? (
                      <button className="stuff-unclaim">STAKE</button>
                    ) : null}
                    {!item?.userStaking && item?.totalRewards > 0 ? (
                      <button
                        onClick={() => {
                          updateStakeRewards(item._id);
                        }}
                        className="stuff-claim"
                      >
                        STAKE
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default PhasePage;
