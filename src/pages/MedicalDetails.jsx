const MedicalDetails = () => {
  return (
    <div className="bg-white flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <form
        action=""
        className="max-w-[600px] mx-auto flex flex-col items-center gap-5 p-5 rounded"
      >
        <h1 className="text-2xl text-center text-black font-bold">
          Update Your Profile
        </h1>
        <input
          type="text"
          placeholder="Health Card Number"
          name="healthCardNumber"
          value=""
          className="border border-black px-4 py-2 w-full"
        />

        <div className="w-full flex items-end gap-2">
          <input
            type="date"
            name="dob"
            value=""
            className="border border-black px-4 py-2 w-full h-[43px]"
          />

          <select
            name="sex"
            defaultValue=""
            className="border border-black px-4 py-2 w-full"
          >
            <option value="" disabled hidden>
              Sex
            </option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="w-full flex gap-2">
          <select
            defaultValue=""
            name="bloodGroup"
            className="border border-black px-4 py-2 w-full"
          >
            <option value="" disabled hidden>
              Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="flex justify-start items-center gap-5 w-full">
          <label htmlFor="">
            In the event of my death, I concent to donate my organs
          </label>
          <input type="checkbox" name="isOrganDonor" id="" />
        </div>
        <input
          type="submit"
          value={'Update medical details'}
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer w-full"
        />
      </form>
    </div>
  )
}
export default MedicalDetails
